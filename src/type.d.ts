interface AppStoreOptions {
  playLineWhileRecording: boolean;
  playbackRate: number;
  autoPlay: boolean;
  autoStopRecording: boolean;
}

interface AppStore {
  sourceUrl: string;
  lines: SubtitleLine[];
  currentLineIndex: number;
  options: AppStoreOptions;
  isRecording: boolean;
  categories: ResourceCategory[];
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

interface ResourceCategory {
  index: number;
  title: string;
  path: string;
  resources: Resource[];
}

interface Resource {
  index: number;
  type: ResourceType;
  title: string;
  duration: string;
  sourceUrl: string;
  subtitleUrl: string;
  subtitlePath: string;
  releasedDate: string;
  from: string;
}
