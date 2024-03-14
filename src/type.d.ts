interface AppStoreOptions {
  playLineWhileRecording: boolean;
  playbackRate: number;
}

interface AppStore {
  isVideo: boolean;
  sourceUrl: string;
  lines: SubtitleLine[];
  options: AppStoreOptions;
}

type ResourceType = "audio" | "video";

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

interface ResourceList {
  [category: string]: Resource[];
}

interface Resource {
  type: ResourceType;
  title: string;
  duration: string;
  sourceUrl: string;
  subtitleUrl: string;
  subtitlePath: string;
  releasedDate: string;
  from: string;
}
