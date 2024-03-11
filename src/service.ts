import { SetStoreFunction, createStore, produce } from "solid-js/store";
import * as ssp from "simple-subtitle-parser";

class AppService {
  private _mediaRef: HTMLMediaElement;
  private _store: AppStore;
  private _setStore: SetStoreFunction<AppStore>;

  public get store() {
    return this._store;
  }

  private async updateLines(text: string, fileName: string) {
    // the library only support \n
    text = text.replaceAll("\r\n", "\n");

    let ext = ssp.extractFormatFromFileName(fileName);
    let cues = await ssp.parser(ext.format, text);

    let lines = cues.map(
      (cue) =>
        ({
          index: cue.sequence,
          start: cue.startTime.totals.inSeconds,
          end: cue.endTime.totals.inSeconds,
          text: cue.text.join(" "),
        } as SubtitleLine)
    );

    this._setStore("lines", lines);
  }

  constructor() {
    // TODO: load options from localStorage
    let stores = createStore({
      sourceFileUrl: "",
      subtitleFileUrl: "",
      currentPlayingLine: -1,
      lines: [],
      options: {
        playLineWhileRecording: true,
        playRate: 1,
      },
    } as AppStore);

    this._store = stores[0];
    this._setStore = stores[1];
  }

  public init(mediaRef: HTMLMediaElement) {
    this._mediaRef = mediaRef;
  }

  public async useDemo(num: string) {
    this._setStore("sourceFileUrl", `/demos/${num}.mp3`);

    let fileName = `/demos/${num}.srt`;
    let res = await fetch(fileName);
    let text = await res.text();

    this.updateLines(text, fileName);
  }

  public updateSourceFile(file: File) {
    this._setStore("sourceFileUrl", URL.createObjectURL(file));
  }

  public async updateSubtitleFile(file: File) {
    let text = await file.text();

    this.updateLines(text, file.name);
  }

  public async updateAudioLineRecord(line: SubtitleLine, chunks: Blob[]) {
    if (line.recordUrl) {
      URL.revokeObjectURL(line.recordUrl);
    }

    this._setStore(
      "lines",
      line.index,
      produce((line) => {
        line.record = new Blob(chunks);
        line.recordUrl = URL.createObjectURL(line.record);
      })
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
}

export default new AppService();
