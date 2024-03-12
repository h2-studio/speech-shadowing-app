import { For, Index, JSXElement, Show } from "solid-js";

import { useService } from "@/service";

import Button from "./Button";
import Line from "./Line";

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
        <Index each={service.store.lines}>
          {(line) => (
            <Line line={line()}/>  
          )}
        </Index>
      </div>
    </>
  );
}
