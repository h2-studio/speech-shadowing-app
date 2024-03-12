interface AppStoreOptions {
  playLineWhileRecording: boolean;
  playRate: number;
}

interface AppStore {
  isReady: boolean;
  isSourceVideo: boolean;
  sourceUrl: string;
  lines: SubtitleLine[];
  options: AppStoreOptions;
}

interface SubtitleLine {
  index: number;
  start: number;
  end: number;
  duration: number;
  text: string;
  record: Blob;
  recordBlobUrl: string;
  isRecording: boolean;
  isPlaying: boolean;
}
