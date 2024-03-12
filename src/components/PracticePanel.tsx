import { For, JSXElement, Show } from "solid-js";

import { useService } from "@/service";

import Button from "./Button";

export default function PlayerPanel(): JSXElement {
  let service = useService();

  return (
    <>
      <div class="text-right my-2">
        <button
          type="button"
          class="p-1 underline"
          onClick={() => {
            service.stopPractice();
          }}
        >
          stop
        </button>
      </div>
      <div>
        <video
          class="w-full"
          classList={{
            "max-h-80": service.store.isSourceVideo,
            "max-h-10": !service.store.isSourceVideo,
          }}
          ref={service.setMediaRef}
          src={service.store.sourceUrl}
          controls
          autoplay={false}
        />
      </div>

      <div class="py-4">
        options:
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
        play which recording
        <Button onClick={() => service.exportRecord()}>save records</Button>
      </div>

      {/* TODO: sticky top */}

      <div class="py-4">
        <For each={service.store.lines}>
          {(line) => (
            <div
              class={
                service.store.currentPlayingLine == line.index
                  ? "bg-blue-200"
                  : ""
              }
            >
              {line.index + 1}. {line.text}
              <Button
                onClick={() => {
                  service.playLine(line);
                }}
              >
                play
              </Button>
              {service.store.currentRecordingLine == line.index ? (
                <Button
                  type="alert"
                  onClick={() => {
                    service.stopRecordingLine();
                  }}
                >
                  stop
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    service.recordLine(line);
                  }}
                >
                  record
                </Button>
              )}
              <Show when={line.recordBlobUrl}>
                <Button
                  onClick={() => {
                    service.playLineRecord(line);
                  }}
                >
                  play record
                </Button>
              </Show>
            </div>
          )}
        </For>
      </div>
    </>
  );
}
