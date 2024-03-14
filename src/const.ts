import { ToastOptions } from "solid-toast";

export const ResourceRepoUrl =
  "https://raw.githubusercontent.com/h2-studio/speech-shadowing-resources/main";

export const ResourceJsonUrl = `${ResourceRepoUrl}/resources.json`;

export const ToastErrorOptions: ToastOptions = {
  style: {
    color: "white",
    "background-color": "#FF4858",
  },
};

export const PlaybackEffects: { [rate: number]: number } = {
  [0.5]: 2,
  [0.75]: 1.33,
  [1]: 1,
  [1.25]: 0.8,
  [1.5]: 0.66,
};
