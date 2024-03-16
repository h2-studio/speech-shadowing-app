import { createMemo, JSXElement, Show } from "solid-js";

import { useService } from "@/service";

import Button from "./Button";

export default function PracticeLine(): JSXElement {
  let service = useService();
  let line = createMemo(
    () => service.store.lines[service.store.currentLineIndex]
  );

  return (
    <div class="grid grid-cols-12">
      <div class="">
        <button
          class="underline hover:text-gray-500"
          onClick={() => service.selectPreviousLine()}
        >
          previous
        </button>
      </div>
      <div class="col-span-10">
        <div>{line().text}</div>
        <div>
          <Button
            onClick={() => {
              service.playLine(line());
            }}
          >
            play
          </Button>
          <Show when={!service.store.isRecording}>
            <Button
              onClick={() => {
                service.recordLine(line());
              }}
            >
              record
            </Button>
          </Show>
          <Show when={service.store.isRecording}>
            <Button
              type="alert"
              onClick={() => {
                service.stopRecord();
              }}
            >
              stop
            </Button>
          </Show>
          <Show when={line().record}>
            <Button
              onClick={() => {
                service.playLineRecord(line());
              }}
            >
              play record
            </Button>
          </Show>
        </div>
      </div>
      <div>
        <button
          class="underline hover:text-gray-500"
          onClick={() => service.selectNextLine()}
        >
          next
        </button>
      </div>
    </div>
  );
}
