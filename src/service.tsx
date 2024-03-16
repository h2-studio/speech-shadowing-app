import Crunker from "crunker";
import * as ssp from "simple-subtitle-parser";
import { Context, createContext, ParentProps, useContext } from "solid-js";
import { createStore, produce, SetStoreFunction } from "solid-js/store";
import toast from "solid-toast";

import { Navigator } from "@solidjs/router";

import { PlaybackEffects, ToastErrorOptions } from "./const";

const AppServiceContext = createContext<AppService>() as Context<AppService>;

class AppService {
  private _mediaRef: HTMLMediaElement;
  private _store: AppStore;
  private _setStore: SetStoreFunction<AppStore>;
  private _crucker: Crunker;
  private _recorder: MediaRecorder;
  private _navigator: Navigator;
  private _playTimeoutId: number;

  public get store() {
    return this._store;
  }

  constructor() {
    let stores = createStore({
      isVideo: false,
      sourceUrl: "",
      lines: [],
      options: {
        playLineWhileRecording: JSON.parse(
          localStorage.getItem("option:playLineWhileRecording")
        ),
        playbackRate:
          JSON.parse(localStorage.getItem("option:playbackRate")) || 1,
      },
      isRecording: false,
    } as AppStore);

    this._store = stores[0];
    this._setStore = stores[1];
  }

  private async parseSubtitle(url: string): Promise<SubtitleLine[]> {
    let res = await fetch(url);
    let text = await res.text();

    // the library only support \n
    text = text.replaceAll("\r\n", "\n");

    let cues = await ssp.parser("SRT" as ssp.Format, text);

    return cues.map(
      (cue) =>
        ({
          index: cue.sequence,
          start: cue.startTime.totals.inSeconds,
          end: cue.endTime.totals.inSeconds,
          duration:
            cue.endTime.totals.inSeconds - cue.startTime.totals.inSeconds,
          text: cue.text.join(" "),
        } as SubtitleLine)
    );
  }

  private async updateLineRecord(line: SubtitleLine, chunks: Blob[]) {
    let buffer = await new Blob(chunks).arrayBuffer();
    let record = await this._crucker.context.decodeAudioData(buffer);
    this._setStore(
      "lines",
      line.index,
      produce((line) => {
        line.record = record;
      })
    );
  }

  private onMediaStart() {
    this._mediaRef.playbackRate = this._store.options.playbackRate;
  }

  private onMediaTimeUpdate() {
    let currentTime = this._mediaRef.currentTime;
    let currentLine = this._store.currentLineIndex
      ? this._store.lines[this._store.currentLineIndex]
      : null;

    if (
      currentLine &&
      currentTime >= currentLine.start &&
      currentTime <= currentLine.end
    ) {
      // still playing the same line
      return;
    }

    // Fine the current line
    // TODO: better line search

    let line = this._store.lines.find(
      (line) => currentTime >= line.start && currentTime <= line.end
    );

    if (line) {
      this.selectLine(line.index);
    }
  }

  private onMediaError() {
    toast.error("Unable to load the media.", ToastErrorOptions);
  }

  public setNavigator(navigator: Navigator) {
    this._navigator = navigator;
  }

  public setMediaRef(mediaRef: HTMLMediaElement) {
    this._mediaRef = mediaRef;

    this._mediaRef.addEventListener("loadstart", () => {
      this.onMediaStart();
    });
    this._mediaRef.addEventListener("timeupdate", () => {
      this.onMediaTimeUpdate();
    });
    this._mediaRef.addEventListener("error", () => {
      this.onMediaError();
    });
  }

  public async startPractice(
    isVideo: boolean,
    sourceUrl: string,
    subtitleUrl: string
  ) {
    try {
      let lines = await this.parseSubtitle(subtitleUrl);

      this._setStore(
        produce((store) => {
          store.isVideo = isVideo;
          store.sourceUrl = sourceUrl;
          store.lines = lines;
        })
      );

      this.navToPractice();
    } catch (error) {
      toast.error("Unable to load the subtitle file.", ToastErrorOptions);
    }
  }

  public navToStart() {
    this._navigator("/");
  }

  public navToPractice() {
    this._navigator("/practice");
  }

  public navToResource() {
    this._navigator("/resource");
  }

  public async useDemo(type: ResourceType) {
    this.startPractice(
      type == "video",
      `${import.meta.env.BASE_URL}demos/${
        type == "video" ? "video.mp4" : "audio.mp3"
      }`,
      `${import.meta.env.BASE_URL}demos/${type}.srt`
    );
  }

  public async updatePlaybackRate(playbackRate: number) {
    this._mediaRef.playbackRate = playbackRate;
    this.updateOption("playbackRate", playbackRate);
  }

  public async updateOption<O extends keyof AppStoreOptions>(
    option: O,
    value: AppStoreOptions[O]
  ) {
    this._setStore("options", option, value);
    localStorage.setItem(`option:${option}`, JSON.stringify(value));
  }

  public selectLine(index: number) {
    this._setStore("currentLineIndex", index);
    if (index != null) {
      let line = this._store.lines[index];

      this._mediaRef.currentTime = line.start;
    }
  }

  public selectPreviousLine() {
    if (this._store.currentLineIndex > 0) {
      this.selectLine(this._store.currentLineIndex - 1);
    }
  }

  public selectNextLine() {
    if (this._store.currentLineIndex < this._store.lines.length) {
      this.selectLine(this._store.currentLineIndex + 1);
    }
  }

  public async playLine(line: SubtitleLine, lowVolume: boolean = false) {
    clearTimeout(this._playTimeoutId);

    this._mediaRef.currentTime = line.start;

    let originVolume: number;
    if (lowVolume) {
      originVolume = this._mediaRef.volume;
      this._mediaRef.volume = 0.1;
    }

    await this._mediaRef.play();

    let duration =
      line.duration * PlaybackEffects[this._mediaRef.playbackRate] * 1000;

    this._playTimeoutId = setTimeout(() => {
      if (!this._mediaRef.paused) {
        if (lowVolume) {
          this._mediaRef.volume = originVolume;
        }

        this._mediaRef.pause();
      }
    }, duration);
  }

  public async playLineRecord(line: SubtitleLine) {
    let source = this._crucker.context.createBufferSource();
    source.buffer = line.record;
    source.connect(this._crucker.context.destination);
    source.start();
  }

  public recordLine(line: SubtitleLine) {
    if (this._recorder?.state == "recording") {
      return;
    }

    if (this._crucker == null) {
      this._crucker = new Crunker();
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        this._setStore("isRecording", true);

        let chunks = [] as Blob[];

        if (this._store.options.playLineWhileRecording) {
          this.playLine(line, true);
        }

        this._recorder = new MediaRecorder(stream);

        this._recorder.start(0);
        this._recorder.ondataavailable = (e) => {
          chunks.push(e.data);

          if (this._recorder.state == "inactive") {
            this._setStore("isRecording", false);
            this.updateLineRecord(line, chunks);
            stream.getTracks().forEach((track) => track.stop());
          }
        };

        // TODO: better stop
        let duration =
          line.duration * PlaybackEffects[this._mediaRef.playbackRate] * 1500; // 1.2x time to stop

        setTimeout(() => {
          this._recorder.stop();
        }, duration);
      });
  }

  public stopRecord() {
    this._recorder?.stop();
  }

  public async exportRecord() {
    // TODO: remove or pad empty audio
    let audioBuffer: AudioBuffer | null = null;

    for (let line of this._store.lines) {
      if (line.record) {
        if (audioBuffer == null) {
          audioBuffer = line.record;
        } else {
          // concatenate each record by crunker
          audioBuffer = this._crucker.concatAudio([audioBuffer, line.record]);
        }
      }
    }

    if (audioBuffer && audioBuffer.length > 0) {
      let exp = await this._crucker.export(audioBuffer, "audio/mpeg");
      let ele = document.createElement("a");
      ele.href = exp.url;

      // TODO: better export name
      let date = new Date().toISOString().substring(0, 10);
      ele.download = `speech-shadowing-record-${date}.mp3`;
      ele.click();
    }
  }
}

export function ServiceProvider(props: ParentProps) {
  let service = new AppService();

  return (
    <AppServiceContext.Provider value={service}>
      {props.children}
    </AppServiceContext.Provider>
  );
}

export function useService(): AppService {
  return useContext(AppServiceContext);
}
