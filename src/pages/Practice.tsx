import {
  createSignal,
  For,
  JSXElement,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import toast from "solid-toast";

import BackButton from "@/components/BackButton";
import PracticeLine from "@/components/PracticeLine";
import VideoPlayer from "@/components/VideoPlayer";
import { ToastErrorOptions } from "@/const";
import { useService } from "@/service";

export default function Practice(props: PageProps): JSXElement {
  let service = useService();

  let params = props.location.query;
  let state = props.location.state as PracticeNavState;
  let [isReady, setIsReady] = createSignal(false);

  let returnHome =
    !params.sourceUrl ||
    !params.subtitleUrl ||
    (params.sourceUrl?.startsWith("blob:") == true &&
      state?.fromNavigator != true) ||
    (params.subtitleUrl?.startsWith("blob:") == true &&
      state?.fromNavigator != true);

  if (returnHome) {
    service.navToHome();
    return;
  }

  let onKeyEvent = (e: KeyboardEvent) => {
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        service.selectPreviousLine();
        break;
      case "ArrowRight":
      case "KeyD":
        service.selectNextLine();
        break;
      case "Escape":
        service.unselectLine();
        break;
      case "KeyQ":
      case "Enter":
        if (service.store.isRecording) {
          service.stopRecord();
        } else {
          service.recordSelectLine();
        }
        break;
      case "KeyW":
      case "ArrowUp":
        service.playSelectLine();
        break;
      case "ArrowDown":
      case "KeyS":
        service.playSelectLineRecord();
        break;
    }

    return false;
  };

  let exportRecord = () => {
    let tId = toast.loading("exporting");
    service
      .exportRecord()
      .catch((e) => {
        toast.error("export failed");
      })
      .finally(() => {
        toast.remove(tId);
      });
  };

  onMount(() => {
    document.addEventListener("keydown", onKeyEvent);

    service
      .startPractice(params.subtitleUrl)
      .then(() => {
        setIsReady(true);
      })
      .catch(() => {
        toast.error("Unable to load the subtitle file.", ToastErrorOptions);
      });
  });

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyEvent);

    service.stopPractice();
  });

  return (
    <>
      <div class="my-10">
        <BackButton
          onClick={() => {
            service.navToStart();
          }}
        />
      </div>

      <Show when={isReady()} fallback="loading">
        <VideoPlayer src={params.sourceUrl} />

        <div class="box my-5 relative">
          options:
          <span class="mx-2">
            play while recording{" "}
            <input
              type="checkbox"
              onClick={() => {
                service.updateOption(
                  "playLineWhileRecording",
                  !service.store.options.playLineWhileRecording
                );
              }}
              checked={service.store.options.playLineWhileRecording}
            />
          </span>
          <span class="mx-2">
            auto stop recoding{" "}
            <input
              type="checkbox"
              onClick={() => {
                service.updateOption(
                  "autoStopRecording",
                  !service.store.options.autoStopRecording
                );
              }}
              checked={service.store.options.autoStopRecording}
            />
          </span>
          <span class="mx-2">
            auto play{" "}
            <input
              type="checkbox"
              onClick={() => {
                service.updateOption(
                  "autoPlay",
                  !service.store.options.autoPlay
                );
              }}
              checked={service.store.options.autoPlay}
            />
          </span>
          <span>
            , rate:{" "}
            <select
              class="border border-gray-500"
              value={service.store.options.playbackRate}
              onChange={(e) => {
                service.updatePlaybackRate(JSON.parse(e.target.value));
              }}
            >
              <option value="0.5">0.5</option>
              <option value="0.75">0.75</option>
              <option value="1">1</option>
              <option value="1.25">1.25</option>
              <option value="1.5">1.5</option>
            </select>
          </span>
          <span class="mx-2 absolute right-0">
            <button
              type="button"
              class="hover:text-gray-500 disabled:text-gray-400"
              disabled={!service.store.hasRecord}
              onClick={exportRecord}
            >
              save records
            </button>
          </span>
        </div>

        <div class="box my-5">
          <Show when={service.store.currentLineIndex == null}>
            <For each={service.store.lines}>
              {(line) => (
                <div
                  class="py-1 hover:bg-blue-100 cursor-pointer"
                  onClick={() => service.selectLine(line.index)}
                >
                  {line.index + 1}. {line.text}
                </div>
              )}
            </For>
          </Show>
          <Show when={service.store.currentLineIndex != null}>
            <div>
              <div class="text-right">
                <button
                  type="button"
                  title="end practice (Esc)"
                  class="text-4xl text-black hover:text-gray-500"
                  onClick={() => service.unselectLine()}
                >
                  <i class="fa-solid fa-circle-xmark"></i>
                </button>
              </div>
              <PracticeLine />
            </div>
          </Show>
        </div>
      </Show>
    </>
  );
}
