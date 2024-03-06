interface AppStore {
  audioFileUrl: string;
  audioLines: AudioLine[];
  optionPlayLineWhileRecording: boolean;
}

interface AudioLine {
  index: number;
  start: number;
  end: number;
  text: string;
  record: Blob;
  recordUrl: string;
}
