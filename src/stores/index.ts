import { createStore } from "solid-js/store";
import * as ssp from "simple-subtitle-parser";

interface AppStore {
  audioFileSrc: string;
  audioSubCues: ssp.Cue[];
}

const [store, setStore] = createStore({
  audioFileSrc: "",
  audioSubCues: [],
} as AppStore);

const appStore = {
  store,
  setStore,
  updateAudioFile: (file: File) => {
    setStore("audioFileSrc", URL.createObjectURL(file));
  },
  updateAudioSubFile: async (file: File) => {
    let text = await file.text();

    // the library only support \n
    text = text.replaceAll("\r\n", "\n");

    let ext = ssp.extractFormatFromFileName(file.name);
    let cues = await ssp.parser(ext.format, text);

    setStore("audioSubCues", cues);
  },
};

export default appStore;
