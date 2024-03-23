import { ToastOptions } from "solid-toast";

export const ResourceRepoUrl =
  "https://raw.githubusercontent.com/team-h2/repeat-resources/main";

export const ToastErrorOptions: ToastOptions = {
  style: {
    color: "white",
    "background-color": "#FF4858",
  },
};

export const PlaybackEffects: { [rate: number]: number } = {
  [0.5]: 1 / 0.5,
  [0.75]: 1 / 0.75,
  [1]: 1,
  [1.25]: 1 / 1.25,
  [1.5]: 1 / 1.5,
};
