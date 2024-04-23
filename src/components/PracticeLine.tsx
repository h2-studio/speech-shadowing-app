import { createMemo, createSignal, JSXElement, Show } from "solid-js";

import { useService } from "@/service";

import Button from "./Button";
import RecordButton from "./RecordButton";

export default function PracticeLine(): JSXElement {
  let service = useService();
  let [domainData, setDomainData] = createSignal<number[]>();

  let line = createMemo(
    () => service.store.lines[service.store.currentLineIndex]
  );

  service.onDomainDataAvailable = setDomainData;

  let onRecord = () => {
    if (service.store.isRecording) {
      service.stopRecord();
    } else {
      service.recordSelectLine();
    }
  };

  return (
    <>
      <div class="text-center text-lg mt-5">{line().text}</div>

      <div class="flex justify-center mt-5">
        <div class="text-center w-20">
          <button
            type="button"
            title="go to previous (Left Arrow, A)"
            class="hover:text-gray-500 disabled:text-gray-500"
            disabled={line().isFirstLine}
            onClick={() => service.selectPreviousLine()}
          >
            <i class="block text-4xl fa-solid fa-circle-left"></i>
            previous
          </button>
        </div>
        <div class="text-center w-20">
          <button
            type="button"
            title="play (Up Arrow, W)"
            class="hover:text-gray-500"
            onClick={() => {
              service.playLine(line());
            }}
          >
            <i class="block text-4xl fa-solid fa-circle-play"></i>
            play
          </button>
        </div>
        <Show when={line().record}>
          <button
            type="button"
            title="play recording (Down Arrow, S)"
            onClick={() => {
              service.playLineRecord(line());
            }}
          >
            <i class="block text-4xl fa-solid fa-circle-dot"></i>
            play record
          </button>
        </Show>
        <div class="text-center w-20">
          <button
            type="button"
            title="go to next line (Right Arrow, D)"
            class="hover:text-gray-500 disabled:text-gray-500"
            disabled={line().isLastLine}
            onClick={() => service.selectNextLine()}
          >
            <i class="block text-4xl fa-solid fa-circle-right"></i>
            next
          </button>
        </div>
      </div>

      <div class="text-center mt-5">
        <RecordButton
          isRecording={service.store.isRecording}
          domainData={domainData()}
          onClick={onRecord}
        />
      </div>
    </>
  );
}
