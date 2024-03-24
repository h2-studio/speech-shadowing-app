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
    <section class="my-10">
      <h2 class="text-4xl text-center text-title">HOW TO USE</h2>

      <div class="mt-10 grid xl:grid-cols-2 gap-10">
        <div class="box-option relative">
          <div class="grid place-items-center">
            <h3 class="mt-8 text-2xl text-title text-primary">OPTION 1:</h3>

            <p class="mt-4 text-lg text-title">
              USE RESOURCES FROM RE:REPEAT
            </p>
            <p class="mt-2 max-w-96 text-lg text-center">
              <span>You can use and contribute to </span>
              <a
                class="default"
                href="https://github.com/team-h2/repeat-resources"
                target="_blank"
              >
                Re:peat-Resources
              </a>
              <span>, a public repository for shared resources.</span>
            </p>
          </div>

          <div class="absolute bottom-12 left-0 right-0 text-center">
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
          <div class="grid place-items-center">
            <h3 class="mt-8 text-2xl text-title text-primary">OPTION 2:</h3>
            <p class="mt-4 text-lg text-title">
              LOAD A FILE FROM YOUR COMPUTER
            </p>
            <p class="mt-2 max-w-96 text-center text-lg">
              You can use video(.mp4), audio(.mp3) and subtitle(.srt) files form
              your computer.
            </p>

            <button
              type="button"
              class="mt-6 btn-file"
              onClick={() => {
                sourceFileInputRef.click();
              }}
              title="select an .mp4 or .mp3 file from your computer"
            >
              <i class="fa-solid fa-paperclip text-2xl flex-none mr-2"></i>
              <span class="flex-1 line-clamp-1 text-start">
                {sourceFileName() ? sourceFileName() : "video.mp4 / audio.mp3"}
              </span>
              <i class="flex-none fa-solid fa-square-arrow-up-right text-4xl ml-2"></i>
            </button>

            <div class="bg-primary w-10 h-1 mx-auto mt-6"></div>

            <button
              type="button"
              class="mt-6 btn-file"
              onClick={() => {
                subtitleFileInputRef.click();
              }}
              title="select an .srt file from your computer"
            >
              <i class="fa-solid fa-paperclip text-2xl flex-none mr-2"></i>
              <span class="flex-1 line-clamp-1 text-start">
                {subtitleFileName() ? subtitleFileName() : "subtitle.srt"}
              </span>
              <i class="flex-none fa-solid fa-square-arrow-up-right text-4xl ml-2"></i>
            </button>
          </div>

          <div class="absolute bottom-12 left-0 right-0 text-center">
            <button type="button" class="btn-primary-sm" onClick={start}>
              LOAD RESOURCES <i class="fa-solid fa-play ms-2"></i>
            </button>
          </div>
        </div>
      </div>

      <h2 class="text-4xl text-center text-title mt-10">
        HOW TO GET RESOURCES
      </h2>
      <div class="mt-10 box grid place-items-center">
        <i class="fa-regular fa-circle-play text-4xl"></i>
        <h3 class="mt-5 text-title text-lg">TO OBTAIN A VIDEO OR AUDIO FILE</h3>
        <p class="mt-2 max-w-96 text-center">
          You can find them on various podcast or news websites such as{" "}
          <a href="https://learningenglish.voanews.com/" target="_blank">
            VOA
          </a>
          <span> or </span>
          <a href="https://www.bbc.co.uk/learningenglish/" target="_blank">
            BBC
          </a>
          .
        </p>

        <i class="mt-10 fa-regular fa-closed-captioning text-4xl"></i>
        <h3 class="mt-5 text-title text-lg">TO OBTAIN A SUBTITLE FILE</h3>

        <p class="mt-2 max-w-96 text-center">
          It can be challenging as source websites typically do not offer them.
          Nevertheless, you can utilize tools like{" "}
          <a
            href="https://github.com/SubtitleEdit/subtitleedit"
            target="_blank"
          >
            SubtitleEdit
          </a>{" "}
          or AI tools to generate subtitles.
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
        accept=".srt, .webvtt"
        onchange={onAudioSubFileSelected}
      />
    </section>
  );
}
