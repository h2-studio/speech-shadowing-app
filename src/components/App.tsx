import { For, JSXElement, Show, createSignal, onMount } from "solid-js";
import Crunker from "crunker";
import Header from "./Header";
import Button from "./Button";

import service from "../service";

export default function App(): JSXElement {
  let audioRef: HTMLAudioElement;
  let audioFileInputRef: HTMLInputElement;
  let audioSubFileInputRef: HTMLInputElement;
  let downloadLinkRef: HTMLAnchorElement;

  let recorder: MediaRecorder;

  let [recordingLine, setRecordingLine] = createSignal(-1);

  onMount(() => {
    service.init(audioRef);
  });

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

  const playRecordedLine = async (line: SubtitleLine) => {
    let recordAudio = new Audio(line.recordUrl);
    recordAudio.play();
  };

  const recordLine = (line: SubtitleLine) => {
    if (recordingLine() > 0) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        setRecordingLine(line.index);

        let chunks = [] as Blob[];

        if (service.store.options.playLineWhileRecording) {
          service.playLine(line, true);
        }

        recorder = new MediaRecorder(stream);

        recorder.start(0);
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);

          if (recorder.state == "inactive") {
            setRecordingLine(-1);
            service.updateAudioLineRecord(line, chunks);
            stream.getTracks().forEach((track) => track.stop());
          }
        };

        // TODO: better stop
        setTimeout(() => {
          recorder.stop();
        }, (line.end - line.start + 1) * 1000);
      });
  };

  const stopRecordLine = () => {
    recorder?.stop();
  };

  const saveRecord = async () => {
    let crunker = new Crunker();
    let audioBuffer: AudioBuffer | null = null;

    for (let line of service.store.lines) {
      if (line.record) {
        let temp = await crunker.context.decodeAudioData(
          await line.record.arrayBuffer()
        );

        if (audioBuffer == null) {
          audioBuffer = temp;
        } else {
          audioBuffer = crunker.concatAudio([audioBuffer, temp]);
        }
      }
    }

    if (audioBuffer && audioBuffer.length > 0) {
      let exp = await crunker.export(audioBuffer, "audio/mpeg");
      downloadLinkRef.href = exp.url;
      downloadLinkRef.download = "output.mp3";

      downloadLinkRef.click();
    }
  };

  return (
    <>
      <Header />
      <div class="grid grid-cols-3 py-4">
        <div>
          <audio
            class="w-full"
            ref={(ref) => (audioRef = ref)}
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
        <Button onClick={saveRecord}>save records</Button>
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
              {recordingLine() == line.index ? (
                <Button
                  type="alert"
                  onClick={() => {
                    stopRecordLine();
                  }}
                >
                  stop
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    recordLine(line);
                  }}
                >
                  record
                </Button>
              )}
              <Show when={line.recordUrl}>
                <Button
                  onClick={() => {
                    playRecordedLine(line);
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
      <a ref={(ref) => (downloadLinkRef = ref)} style="display:none" />
    </>
  );
}
