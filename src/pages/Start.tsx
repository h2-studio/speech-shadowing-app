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
    let isSourceVideo = false;

    if (sourceFileInputRef.files?.length) {
      sourceUrl = URL.createObjectURL(sourceFileInputRef.files[0]);
      isSourceVideo = sourceFileInputRef.files[0].name.endsWith(".mp4");
    } else if (sourceUrlInputRef.value) {
      sourceUrl = sourceUrlInputRef.value;
      isSourceVideo = sourceUrl.endsWith(".mp4");
    }

    if (subtitleFileInputRef.files?.length) {
      subtitleUrl = URL.createObjectURL(subtitleFileInputRef.files[0]);
    } else if (subtitleUrlInputRef.value) {
      subtitleUrl = subtitleUrlInputRef.value;
    }

    if (sourceUrl && subtitleUrl) {
      service.startPractice(isSourceVideo, sourceUrl, subtitleUrl);
    } else {
      toast.error(
        "please provide resources before click start practice button",
        ToastErrorOptions
      );
    }
  };

  return (
    <div class="text-center">
      <section>
        <h2 class="text-2xl">How to use this app</h2>
        <p class="m-2">
          To use this app, you need to have a video(.mp4) file or an audio(.mp3)
          file and a subtitle(.srt) file, it can be either urls from websites or
          on your computer.
        </p>
        <div class="my-5">
          <h3 class="text-lg">
            provide an video or audio file by the one of fellowing options
          </h3>

          <button
            type="button"
            class="w-full p-1 bg-slate-400 hover:bg-slate-500"
            onClick={() => {
              sourceFileInputRef.click();
            }}
          >
            {sourceFileName()
              ? sourceFileName()
              : "select an .mp3 or .mp4 file"}
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
          <h3 class="text-lg">
            provide an subtitle file by the one of fellowing options
          </h3>

          <button
            type="button"
            class="w-full p-1 bg-slate-400 hover:bg-slate-500"
            onClick={() => {
              subtitleFileInputRef.click();
            }}
          >
            {subtitleFileName() ? subtitleFileName() : "select an .srt file"}
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
            start practice
          </button>
        </div>

        <div class="mt-8">
          <h2 class="text-2xl">
            Use resources from Speech Shadowing Subtitles project
          </h2>

          <p>
            You can also use the subtitles from{" "}
            <a
              class="default"
              href="https://github.com/h2-studio/speech-shadowing-subtitles"
              target="_blank"
            >
              speech shadowing subtitles
            </a>{" "}
            project which is a public project that store shared subtitles
          </p>

          <button
            type="button"
            class="w-full p-1 bg-sky-400 hover:bg-sky-500"
            onClick={() => {
              service.navToResource();
            }}
          >
            select resources
          </button>
        </div>

        <div class="mt-8">
          <p>
            if you just want to try the app, the easiest way is use the demo
            files
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
            and we created the subtitle files on{" "}
            <a
              href="https://github.com/SubtitleEdit/subtitleedit"
              class="default"
              target="_blank"
            >
              SubtitleEdit
            </a>{" "}
            by ourselves.
          </p>
        </div>
      </section>
      <section class="mt-10">
        <h2 class="text-2xl">How to get resources</h2>
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
      </section>
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
