interface AppStoreOptions {
  playLineWhileRecording: boolean;
  playbackRate: number;
  autoPlay: boolean;
  autoStopRecording:boolean;
}

interface AppStore {
  sourceUrl: string;
  lines: SubtitleLine[];
  currentLineIndex: number;
  options: AppStoreOptions;
  isRecording: boolean;
}

type ResourceType = "audio" | "video";

interface SubtitleLine {
  index: number;
  start: number;
  end: number;
  duration: number;
  text: string;
  record: AudioBuffer;
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
