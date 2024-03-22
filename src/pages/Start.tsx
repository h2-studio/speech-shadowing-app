import { createSignal, JSXElement } from "solid-js";
import toast from "solid-toast";

import { ToastErrorOptions } from "@/const";
import { useService } from "@/service";

export default function Start(): JSXElement {
  let sourceFileInputRef!: HTMLInputElement;
  let subtitleFileInputRef!: HTMLInputElement;

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
    }

    if (subtitleFileInputRef.files?.length) {
      subtitleUrl = URL.createObjectURL(subtitleFileInputRef.files[0]);
    }

    if (sourceUrl && subtitleUrl) {
      service.startPractice(sourceUrl, subtitleUrl);
    } else {
      toast.error("please provide resources", ToastErrorOptions);
    }
  };

  return (
    <section class="m-10">
      <h2 class="text-4xl text-center font-title">How to use</h2>

      <div class="mt-10 grid xl:grid-cols-2 gap-14">
        <div class="box-option relative">
          <div class="text-center">
            <h3 class="text-2xl font-title text-primary">OPTION 1:</h3>

            <p class="mt-4 text-lg font-title">
              USE RESOURCES FROM RE:REPEAT REPOSITORY
            </p>
            <p>
              You can use and contribute to
              <a
                class="default"
                href="https://github.com/team-h2/repeat-resources"
                target="_blank"
              >
                Re:peat-Resources
              </a>
              , a public repository for shared resources.
            </p>
          </div>

          <div class="absolute bottom-8 left-0 right-0 text-center">
            <button
              type="button"
              class="btn-primary-sm"
              onClick={() => {
                service.navToResource();
              }}
            >
              SELECT RESOURCES <i class="fa-solid fa-play ms-2"></i>
            </button>
          </div>
        </div>

        <div class="box-option relative">
          <div class="text-center">
            <h3 class="text-2xl font-title text-primary">OPTION 2:</h3>
            <p class="mt-4 text-lg font-title">
              LOAD A FILE FROM YOUR COMPUTER
            </p>
            <p>
              You can use video(.mp4), audio(.mp3) and subtitle(.srt) files form
              your computer.
            </p>

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

            <button
              type="button"
              class="mt-2 w-full p-1 bg-slate-400 hover:bg-slate-500"
              onClick={() => {
                subtitleFileInputRef.click();
              }}
            >
              {subtitleFileName()
                ? subtitleFileName()
                : "select an .srt file from your computer"}
            </button>
          </div>

          <div class="absolute bottom-8 left-0 right-0 text-center">
            <button
              type="button"
              class="btn-primary-sm"
              onClick={start}
            >
              LOAD RESOURCES <i class="fa-solid fa-play ms-2"></i>
            </button>
          </div>
        </div>
      </div>
      <div>
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
    </section>
  );
}
