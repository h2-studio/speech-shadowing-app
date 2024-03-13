import { ToastOptions } from "solid-toast";

export const ResourceRepoUrl =
  "https://raw.githubusercontent.com/h2-studio/speech-shadowing-subtitles/main";


export const ResourceJsonUrl =
  `${ResourceRepoUrl}/resources.json`;

export const ToastErrorOptions: ToastOptions = {
  style: {
    color: "white",
    "background-color": "#FF4858",
  },
};
