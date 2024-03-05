import { createStore } from "solid-js/store";
import * as ssp from "simple-subtitle-parser";

const [store, setStore] = createStore({
  audioFileUrl: "",
  audioLines: [],
  optionPlayLineWhileRecording: true,
} as AppStore);

async function updateAudioLines(text: string, fileName: string) {
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
      } as AudioLine)
  );

  setStore("audioLines", lines);
}

const appStore = {
  store,
  setStore,
  useDemo: async (num: string) => {
    setStore("audioFileUrl", `/demos/${num}.mp3`);

    let fileName = `/demos/${num}.srt`;
    let res = await fetch(fileName);
    let text = await res.text();

    updateAudioLines(text, fileName);
  },
  updateAudioFile: (file: File) => {
    setStore("audioFileUrl", URL.createObjectURL(file));
  },
  updateAudioSubFile: async (file: File) => {
    let text = await file.text();

    updateAudioLines(text, file.name);
  },
  updateAudioLineRecord(line: AudioLine, record: Blob) {
    if (line.recordUrl) {
      URL.revokeObjectURL(line.recordUrl);
    }

    setStore(
      "audioLines",
      line.index,
      "recordUrl",
      URL.createObjectURL(record)
    );
  },
  updateOptionPlayLineWhileRecording() {
    setStore(
      "optionPlayLineWhileRecording",
      !store.optionPlayLineWhileRecording
    );
  },
};

export default appStore;
