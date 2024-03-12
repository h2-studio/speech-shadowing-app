import Crunker from "crunker";
import * as ssp from "simple-subtitle-parser";
import { Context, ParentProps, createContext, useContext } from "solid-js";
import { SetStoreFunction, createStore, produce } from "solid-js/store";

const AppServiceContext = createContext<AppService>() as Context<AppService>;

class AppService {
  private _mediaRef: HTMLMediaElement;
  private _store: AppStore;
  private _setStore: SetStoreFunction<AppStore>;
  private _crucker: Crunker;
  private _audio: HTMLAudioElement;
  private _recorder: MediaRecorder;

  public get store() {
    return this._store;
  }

  constructor() {
    // TODO: load options from localStorage

    let stores = createStore({
      isReady: false,
      isSourceVideo: false,
      sourceUrl: "",
      currentPlayingLine: -1,
      currentRecordingLine: -1,
      lines: [],
      options: {
        playLineWhileRecording: true,
        playRate: 1,
      },
    } as AppStore);

    this._store = stores[0];
    this._setStore = stores[1];

    this._crucker = new Crunker();
    this._audio = new Audio();
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
          text: cue.text.join(" "),
        } as SubtitleLine)
    );
  }

  private async updateLineRecord(line: SubtitleLine, chunks: Blob[]) {
    if (line.recordBlobUrl) {
      URL.revokeObjectURL(line.recordBlobUrl);
    }

    this._setStore(
      "lines",
      line.index,
      produce((line) => {
        line.record = new Blob(chunks);
        line.recordBlobUrl = URL.createObjectURL(line.record);
      })
    );
  }

  public setMediaRef = (mediaRef: HTMLMediaElement) => {
    this._mediaRef = mediaRef;
  };

  public async startPractice(
    isSourceVideo: boolean,
    sourceUrl: string,
    subtitleUrl: string
  ) {
    let lines = await this.parseSubtitle(subtitleUrl);

    this._setStore(
      produce((store) => {
        store.isSourceVideo = isSourceVideo;
        store.sourceUrl = sourceUrl;
        store.lines = lines;
        store.isReady = true;
      })
    );
  }

  public stopPractice() {
    this._setStore(
      produce((store) => {
        store.isReady = false;
      })
    );
  }

  public async useDemo(type: "audio" | "video") {
    this.startPractice(
      type == "video",
      `/demos/${type == "video" ? "video.mp4" : "audio.mp3"}`,
      `/demos/${type}.srt`
    );
  }

  public async updateOption<O extends keyof AppStoreOptions>(
    option: O,
    value: AppStoreOptions[O]
  ) {
    this._setStore("options", option, value);
  }

  public async playLine(line: SubtitleLine, changeVolume: boolean = false) {
    if (this._mediaRef.paused) {
      this._setStore("currentPlayingLine", line.index);

      let oldVolume = this._mediaRef.volume;
      this._mediaRef.currentTime = line.start;

      if (changeVolume) {
        this._mediaRef.volume = 0.1;
      }

      await this._mediaRef.play();

      setTimeout(() => {
        this._setStore("currentPlayingLine", -1);

        if (this._mediaRef.played) {
          if (changeVolume) {
            this._mediaRef.volume = oldVolume;
          }

          this._mediaRef.pause();
        }
      }, (line.end - line.start) * 1000);
    }
  }

  public async playLineRecord(line: SubtitleLine) {
    if (!this._audio.paused) {
      this._audio.pause();
    }

    this._audio.src = line.recordBlobUrl;

    this._audio.play();
  }

  public recordLine(line: SubtitleLine) {
    if (this._store.currentPlayingLine > 0) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        this._setStore("currentRecordingLine", line.index);

        let chunks = [] as Blob[];

        if (this._store.options.playLineWhileRecording) {
          this.playLine(line, true);
        }

        this._recorder = new MediaRecorder(stream);

        this._recorder.start(0);
        this._recorder.ondataavailable = (e) => {
          chunks.push(e.data);

          if (this._recorder.state == "inactive") {
            this._setStore("currentRecordingLine", -1);
            this.updateLineRecord(line, chunks);
            stream.getTracks().forEach((track) => track.stop());
          }
        };

        // TODO: better stop
        setTimeout(() => {
          this._recorder.stop();
        }, (line.end - line.start + 1) * 1000);
      });
  }

  public stopRecordingLine() {
    this._recorder?.stop();
  }

  public async exportRecord() {
    let audioBuffer: AudioBuffer | null = null;

    for (let line of this._store.lines) {
      if (line.record) {
        // decode each record to array buffer
        let temp = await this._crucker.context.decodeAudioData(
          await line.record.arrayBuffer()
        );

        if (audioBuffer == null) {
          audioBuffer = temp;
        } else {
          // concatenate each record by crunker
          audioBuffer = this._crucker.concatAudio([audioBuffer, temp]);
        }
      }
    }

    if (audioBuffer && audioBuffer.length > 0) {
      let exp = await this._crucker.export(audioBuffer, "audio/mpeg");
      let ele = document.createElement("a");
      ele.href = exp.url;

      // TODO: better export name
      ele.download = "speech-shadowing-record.mp3";
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
