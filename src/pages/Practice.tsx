import { For, JSXElement, Show } from "solid-js";

import { useService } from "@/service";

import Button from "../components/Button";
import PracticeLine from "../components/PracticeLine";

export default function Practice(): JSXElement {
  let service = useService();

  return (
    <>
      <div class="my-2">
        <button
          type="button"
          class="p-1 underline"
          onClick={() => {
            service.navToStart();
          }}
        >
          back
        </button>
      </div>
      <div>
        <video
          class="w-full"
          classList={{
            "max-h-80": service.store.isVideo,
            "max-h-10": !service.store.isVideo,
          }}
          ref={(ref) => service.setMediaRef(ref)}
          src={service.store.sourceUrl}
          controls
          autoplay={false}
        />
      </div>

      <div class="py-4">
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
        <Button class="mx-2" onClick={() => service.exportRecord()}>
          save records
        </Button>
      </div>

      {/* TODO: sticky top */}

      <div class="py-4">
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
                class="underline hover:text-gray-500"
                onClick={() => service.selectLine(null)}
              >
                close
              </button>
            </div>
            <PracticeLine />
          </div>
        </Show>
      </div>
    </>
  );
}
