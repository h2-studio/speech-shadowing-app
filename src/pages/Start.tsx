import { createSignal, JSXElement } from "solid-js";
import toast from "solid-toast";

import { ToastErrorOptions } from "@/const";
import { useService } from "@/service";

export default function Start(): JSXElement {
  let sourceFileInputRef!: HTMLInputElement;
  let sourceUrlInputRef!: HTMLInputElement;
  let subtitleFileInputRef!: HTMLInputElement;
  let subtitleUrlInputRef!: HTMLInputElement;

  let service = useService();

  let [sourceFileName, setSourceFileName] = createSignal("");
  let [subtitleFileName, setSubtitleFileName] = createSignal("");

  let onAudioFileSelected = () => {
    if (sourceFileInputRef.files?.length) {
      setSourceFileName(sourceFileInputRef.files[0].name);
    }
  };

  let onAudioSubFileSelected = () => {
    if (subtitleFileInputRef.files?.length) {
      setSubtitleFileName(subtitleFileInputRef.files[0].name);
    }
  };

  let start = () => {
    let sourceUrl = "";
    let subtitleUrl = "";

    if (sourceFileInputRef.files?.length) {
      sourceUrl = URL.createObjectURL(sourceFileInputRef.files[0]);
    } else if (sourceUrlInputRef.value) {
      sourceUrl = sourceUrlInputRef.value;
    }

    if (subtitleFileInputRef.files?.length) {
      subtitleUrl = URL.createObjectURL(subtitleFileInputRef.files[0]);
    } else if (subtitleUrlInputRef.value) {
      subtitleUrl = subtitleUrlInputRef.value;
    }

    if (sourceUrl && subtitleUrl) {
      service.startPractice(sourceUrl, subtitleUrl);
    } else {
      toast.error("please provide resources", ToastErrorOptions);
    }
  };

  return (
    <div class="text-center">
      <div>
        <h2 class="text-2xl">How to use this app</h2>
        <p class="m-5">There are two ways to use this app.</p>

        <div class="mt-5 border border-gray-400 p-4 rounded-md">
          <h3 class="text-2xl">
            1. use resources from Repeat-Resource repository
          </h3>

          <p>
            You can use the resource from{" "}
            <a
              class="default"
              href="https://github.com/h2-studio/repeat-resources"
              target="_blank"
            >
              Repeat-Resources
            </a>{" "}
            which is a public repository storing shared resources.{" "}
            <b>You can also contribute resources as well!</b>
          </p>

          <button
            type="button"
            class="w-full p-2 mt-4 bg-sky-400 hover:bg-sky-500"
            onClick={() => {
              service.navToResource();
            }}
          >
            select resources
          </button>
        </div>
        <div class="mt-5 border border-gray-400 p-4 rounded-md">
          <h3 class="text-2xl">
            2. load an video or audio file form your computer or urls
          </h3>
          <p>
            you can use a video(.mp4) file or an audio(.mp3) file and a
            subtitle(.srt) file form other websites or from your computer.
          </p>
          <div class="my-5">
            <button
              type="button"
              class="w-full p-1 bg-slate-400 hover:bg-slate-500"
              onClick={() => {
                sourceFileInputRef.click();
              }}
            >
              {sourceFileName()
                ? sourceFileName()
                : "select an .mp3 or .mp4 file from your computer"}
            </button>
            <p>or</p>
            <input
              ref={sourceUrlInputRef}
              type="text"
              class="w-full border border-gray-800 p-1"
              placeholder="input the url of an .mp3 or .mp4 file"
            />
          </div>

          <div class="my-5">
            <button
              type="button"
              class="w-full p-1 bg-slate-400 hover:bg-slate-500"
              onClick={() => {
                subtitleFileInputRef.click();
              }}
            >
              {subtitleFileName()
                ? subtitleFileName()
                : "select an .srt file from your computer"}
            </button>
            <p>or</p>
            <input
              ref={subtitleUrlInputRef}
              type="text"
              class="w-full border border-gray-800 p-1"
              placeholder="input the url of .srt file"
            />
          </div>

          <div>
            <button
              type="button"
              class="w-full p-1 bg-sky-400 hover:bg-sky-500"
              onClick={start}
            >
              load resources
            </button>
          </div>
        </div>

        <h3 class="mt-5 text-2xl">Demo</h3>

        <div class="mt-5 border border-gray-400 p-4 rounded-md">
          <p>
            if you just want to try the app, the easiest way is use these demo
            resources
          </p>

          <div class="columns-2 mx-10">
            <div>
              <button
                type="button"
                class="w-full p-1 border bg-slate-400 hover:bg-slate-500"
                onClick={() => service.useDemo("audio")}
              >
                try the demo audio file
              </button>
            </div>
            <div>
              <button
                type="button"
                class="w-full p-1 border bg-slate-400 hover:bg-slate-500"
                onClick={() => service.useDemo("video")}
              >
                try the demo video file
              </button>
            </div>
          </div>
          <p>
            The demo{" "}
            <a
              href="https://learningenglish.voanews.com/a/offering-coffee-and-tea/7277846.html"
              class="default"
              target="_blank"
            >
              audio
            </a>{" "}
            and{" "}
            <a
              href="https://learningenglish.voanews.com/a/7516761.html"
              class="default"
              target="_blank"
            >
              video
            </a>{" "}
            were downloaded from{" "}
            <a
              href="https://learningenglish.voanews.com/"
              target="_blank"
              class="default"
            >
              VOA Learning English
            </a>{" "}
            and we created the subtitles on{" "}
            <a
              href="https://github.com/SubtitleEdit/subtitleedit"
              class="default"
              target="_blank"
            >
              SubtitleEdit
            </a>{" "}
            manually.
          </p>
        </div>
      </div>
      <h2 class="my-5 text-2xl">How to get resources</h2>
      <div class="my-5 border border-gray-400 p-4 rounded-md">
        <p>
          To get an video or an audio file, you can get them from any podcast or
          news website. For example:
        </p>
        <ul class="ms-10 list-disc text-left">
          <li>VOA</li>
          <li>BBC</li>
        </ul>
        <p class="mt-2">
          To get an subtitle file for the video or the audio file might be
          tricky, since the source websites usually doesn't provide them.
          However, you can use tools like Subtitle Edit or a AI tool to generate
          them.
        </p>
      </div>
      <input
        ref={sourceFileInputRef}
        type="file"
        style="display:none"
        accept=".mp3, .mp4"
        onchange={onAudioFileSelected}
      />
      <input
        ref={subtitleFileInputRef}
        type="file"
        style="display:none"
        accept=".srt"
        onchange={onAudioSubFileSelected}
      />
    </div>
  );
}
