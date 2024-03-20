import * as ssp from "simple-subtitle-parser";
import { createStore, produce, SetStoreFunction } from "solid-js/store";
import toast from "solid-toast";

import { PlaybackEffects, ToastErrorOptions } from "@/const";
import { Navigator } from "@solidjs/router";

import { AudioService } from "./audio-service";

export class AppService {
  private _videoRef: HTMLVideoElement;
  private _store: AppStore;
  private _setStore: SetStoreFunction<AppStore>;
  private _navigator: Navigator;
  private _playTimeoutId: number;
  private _audioService: AudioService;

  public get onDomainDataAvailable() {
    return this._audioService.onDomainDataAvailable;
  }

  public set onDomainDataAvailable(fn: (data: number[]) => void) {
    this._audioService.onDomainDataAvailable = fn;
  }

  public get store() {
    return this._store;
  }

  constructor() {
    // TODO: better load options
    let stores = createStore({
      sourceUrl: "",
      lines: [],
      options: {
        playLineWhileRecording: JSON.parse(
          localStorage.getItem("option:playLineWhileRecording")
        ),
        playbackRate:
          JSON.parse(localStorage.getItem("option:playbackRate")) || 1,
        autoStopRecording: JSON.parse(
          localStorage.getItem("option:autoStopRecording")
        ),
      },
      isRecording: false,
    } as AppStore);

    this._store = stores[0];
    this._setStore = stores[1];

    this._audioService = new AudioService();
    this._audioService.onStateUpdate = (isRecording) => {
      this._setStore("isRecording", isRecording);
    };
    this._audioService.autoStopRecording =
      this._store.options.autoStopRecording;
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

  private onMediaLoaded() {
    // update elements

    this._videoRef.playbackRate = this._store.options.playbackRate;
    // use the height to detect it is video or audio
    if (this._videoRef.videoHeight == 0) {
      // show control on video
      this._videoRef.classList.add("max-h-10");
      this._videoRef.classList.remove("max-h-80");
    } else {
      this._videoRef.classList.add("max-h-80");
      this._videoRef.classList.remove("max-h-10");
    }
  }

  private onMediaTimeUpdate() {
    let currentTime = this._videoRef.currentTime;
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
      this.selectLine(line.index, false);
    }
  }

  private onMediaError() {
    toast.error("Unable to load the media.", ToastErrorOptions);
  }

  public setNavigator(navigator: Navigator) {
    this._navigator = navigator;
  }

  public setMediaRef(mediaRef: HTMLVideoElement) {
    this._videoRef = mediaRef;
    this._videoRef.disablePictureInPicture = true;

    this._videoRef.addEventListener("loadedmetadata", () => {
      this.onMediaLoaded();
    });
    this._videoRef.addEventListener("timeupdate", () => {
      this.onMediaTimeUpdate();
    });
    this._videoRef.addEventListener("error", () => {
      this.onMediaError();
    });
  }

  public async startPractice(sourceUrl: string, subtitleUrl: string) {
    try {
      let lines = await this.parseSubtitle(subtitleUrl);

      this._setStore(
        produce((store) => {
          store.sourceUrl = sourceUrl;
          store.lines = lines;
          store.currentLineIndex = null;
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
      `${import.meta.env.BASE_URL}demos/${
        type == "video" ? "video.mp4" : "audio.mp3"
      }`,
      `${import.meta.env.BASE_URL}demos/${type}.srt`
    );
  }

  public async updatePlaybackRate(playbackRate: number) {
    this._videoRef.playbackRate = playbackRate;
    this.updateOption("playbackRate", playbackRate);
  }

  public async updateOption<O extends keyof AppStoreOptions>(
    option: O,
    value: AppStoreOptions[O]
  ) {
    this._setStore("options", option, value);
    localStorage.setItem(`option:${option}`, JSON.stringify(value));

    if (option == "autoStopRecording") {
      this._audioService.autoStopRecording = value as boolean;
    }
  }

  public selectLine(index: number, updateTime: boolean = true) {
    this._setStore("currentLineIndex", index);
    if (index != null) {
      let line = this._store.lines[index];

      if (updateTime) {
        this._videoRef.currentTime = line.start;
      }
    }
  }
  public unselectLine() {
    this._setStore("currentLineIndex", null);
  }

  public selectPreviousLine() {
    if (this._store.currentLineIndex == null) {
      this.selectLine(0);
    } else if (this._store.currentLineIndex > 0) {
      this.selectLine(this._store.currentLineIndex - 1);
    }
  }

  public selectNextLine() {
    if (this._store.currentLineIndex == null) {
      this.selectLine(0);
    } else if (this._store.currentLineIndex < this._store.lines.length) {
      this.selectLine(this._store.currentLineIndex + 1);
    }
  }

  public playSelectLine() {
    this.playLine(this._store.lines[this._store.currentLineIndex || 0]);
  }

  public playSelectLineRecord() {
    if (this._store.currentLineIndex != null) {
      this.playLineRecord(this._store.lines[this._store.currentLineIndex]);
    }
  }

  public recordSelectLine() {
    if (this._store.currentLineIndex != null) {
      this.recordLine(this._store.lines[this._store.currentLineIndex]);
    }
  }

  public async playLine(line: SubtitleLine, lowVolume: boolean = false) {
    clearTimeout(this._playTimeoutId);

    this._videoRef.currentTime = line.start;

    let originVolume: number;
    if (lowVolume) {
      originVolume = this._videoRef.volume;
      this._videoRef.volume = 0.1;
    }

    await this._videoRef.play();

    let duration =
      line.duration * PlaybackEffects[this._videoRef.playbackRate] * 1000;

    this._playTimeoutId = setTimeout(() => {
      if (!this._videoRef.paused) {
        if (lowVolume) {
          this._videoRef.volume = originVolume;
        }

        this._videoRef.pause();
      }
    }, duration);
  }

  public async playLineRecord(line: SubtitleLine) {
    if (!line.record) {
      return;
    }

    this._audioService.play(line.record);
  }

  public recordLine(line: SubtitleLine) {
    if (this._store.isRecording) {
      return;
    }

    this._audioService.record((record) => {
      this._setStore("lines", line.index, "record", record);
    });
  }

  public stopRecord() {
    this._audioService?.stop();
  }

  public async exportRecord() {
    this._audioService.export(
      this._store.lines.map((l) => l.record).filter((r) => r)
    );
  }
}
