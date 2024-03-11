interface AppStoreOptions {
  playLineWhileRecording: boolean;
  playRate: number;
}

interface AppStore {
  sourceFileUrl?: string;
  subtitleFileUrl?: string;
  lines: SubtitleLine[];
  options: AppStoreOptions;
  currentPlayingLine: number;
  currentRecordingLine: number;
}

interface SubtitleLine {
  index: number;
  start: number;
  end: number;
  text: string;
  record: Blob;
  recordBlobUrl: string;
}
