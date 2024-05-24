interface AppStoreOptions {
  playLineWhileRecording: boolean;
  playbackRate: number;
  autoPlay: boolean;
  autoStopRecording: boolean;
}

interface AppStore {
  categories: ResourceCategory[];
  currentLineIndex: number;
  hasRecord: boolean;
  isRecording: boolean;
  isPlaying: boolean;
  isPlayingRecord: boolean;
  lines: SubtitleLine[];
  options: AppStoreOptions;
  subtitleUrl: string;
}

type ResourceType = "audio" | "video";

interface SubtitleLine {
  index: number;
  start: number;
  end: number;
  duration: number;
  text: string;
  phonetics: Array<[number, number, string]>;
  html: string;
  record: AudioBuffer;
  isFirstLine: boolean;
  isLastLine: boolean;
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

interface PageProps<T = any> {
  location: import("@solidjs/router").Location;
  params: T;
}

interface PracticeNavState {
  fromNavigator: boolean;
}

interface PracticeRecord {
  subtitleUrl: string;
  times: number;
  practicedAt: Date;
}
