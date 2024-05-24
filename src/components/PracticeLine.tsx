import { createMemo, createSignal, JSXElement } from "solid-js";

import { useService } from "@/service";

import PlayButton from "./PlayButton";
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
      <p
        class="text-center text-lg mt-5 tracking-widest"
        innerHTML={line().html || line().text}
      />

      <div class="flex justify-center mt-5">
        <button
          type="button"
          title="go to previous (Left Arrow, A)"
          class="w-24 hover:text-gray-500 disabled:text-gray-300"
          disabled={line().isFirstLine}
          onClick={() => service.selectPreviousLine()}
        >
          <i class="block text-4xl fa-solid fa-circle-left"></i>
          previous
        </button>

        <PlayButton
          text="play"
          title="play (Up Arrow, W)"
          isPlaying={service.store.isPlaying}
          onClick={() => {
            if (service.store.isPlaying) {
              service.stopAll();
            } else {
              service.playLine(line());
            }
          }}
        />

        <PlayButton
          text="play record"
          title="play recording (Down Arrow, S)"
          playIcon="fa-record-vinyl"
          isPlaying={service.store.isPlayingRecord}
          isDisabled={line().record == null}
          onClick={() => {
            if (service.store.isPlayingRecord) {
              service.stopAll();
            } else {
              service.playLineRecord(line());
            }
          }}
        />

        <button
          type="button"
          title="go to next line (Right Arrow, D)"
          class="w-24 hover:text-gray-500 disabled:text-gray-300"
          disabled={line().isLastLine}
          onClick={() => service.selectNextLine()}
        >
          <i class="block text-4xl fa-solid fa-circle-right"></i>
          next
        </button>
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
