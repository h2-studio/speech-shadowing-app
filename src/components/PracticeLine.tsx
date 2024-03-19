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
    <div class="grid grid-cols-12">
      <div class="">
        <button
          title="go to previous (Left Arrow, A)"
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
            title="play (Space, W)"
            onClick={() => {
              service.playLine(line());
            }}
          >
            play
          </Button>
         
          <Show when={line().record}>
            <Button
              title="play recording (Ctrl + Space, S)"
              onClick={() => {
                service.playLineRecord(line());
              }}
            >
              play record
            </Button>
          </Show>
        </div>
        <div>
          <RecordButton
            isRecording={service.store.isRecording}
            domainData={domainData()}
            onClick={onRecord}
          />
        </div>
      </div>
      <div>
        <button
          title="go to next line (Right Arrow, D)"
          class="underline hover:text-gray-500"
          onClick={() => service.selectNextLine()}
        >
          next
        </button>
      </div>
    </div>
  );
}
