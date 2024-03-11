import { For, JSXElement, Show } from "solid-js";
import Button from "./Button";
import Header from "./Header";

import service from "../service";

export default function App(): JSXElement {
  let audioFileInputRef: HTMLInputElement;
  let audioSubFileInputRef: HTMLInputElement;

  const onAudioFileSelected = (e: Event) => {
    if (audioFileInputRef.files != null) {
      service.updateSourceFile(audioFileInputRef.files[0]);
    }
  };

  const onAudioSubFileSelected = (e: Event) => {
    if (audioSubFileInputRef.files != null) {
      service.updateSubtitleFile(audioSubFileInputRef.files[0]);
    }
  };

  return (
    <>
      <Header />
      <div class="grid grid-cols-3 py-4">
        <div>
          <audio
            class="w-full"
            ref={service.setMediaRef}
            src={service.store.sourceFileUrl}
            controls
            autoplay={false}
          />
        </div>

        <div class="col-span-2">
          <Button
            onClick={() => {
              audioFileInputRef.click();
            }}
          >
            Select an audio file
          </Button>

          <Button
            onClick={() => {
              audioSubFileInputRef.click();
            }}
          >
            Select an audio subtitle file
          </Button>

          <Button onClick={() => service.useDemo("01")}>
            Use the demo audio file
          </Button>
        </div>
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
                    service.stopRecording();
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
      <input
        ref={(ref) => (audioFileInputRef = ref)}
        type="file"
        style="display:none"
        accept=".mp3"
        onchange={onAudioFileSelected}
      />
      <input
        ref={(ref) => (audioSubFileInputRef = ref)}
        type="file"
        style="display:none"
        accept=".srt"
        onchange={onAudioSubFileSelected}
      />
    </>
  );
}
