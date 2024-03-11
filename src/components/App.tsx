import { For, JSXElement, Show, createSignal } from "solid-js";
import Crunker from "crunker";
import appStore from "../stores";
import Header from "./Header";
import Button from "./Button";

export default function App(): JSXElement {
  let audioRef: HTMLAudioElement;
  let audioFileInputRef: HTMLInputElement;
  let audioSubFileInputRef: HTMLInputElement;
  let downloadLinkRef: HTMLAnchorElement;

  let recorder: MediaRecorder;

  let [playingLine, setPlayingLine] = createSignal(-1);
  let [recordingLine, setRecordingLine] = createSignal(-1);

  const onAudioFileSelected = (e: Event) => {
    if (audioFileInputRef.files != null) {
      appStore.updateAudioFile(audioFileInputRef.files[0]);
    }
  };

  const onAudioSubFileSelected = (e: Event) => {
    if (audioSubFileInputRef.files != null) {
      appStore.updateAudioSubFile(audioSubFileInputRef.files[0]);
    }
  };

  const playLine = async (line: AudioLine, changeVolume: boolean = false) => {
    if (audioRef.paused) {
      setPlayingLine(line.index);

      let oldVolume = audioRef.volume;
      audioRef.currentTime = line.start;

      if (changeVolume) {
        audioRef.volume = 0.1;
      }

      await audioRef.play();

      setTimeout(() => {
        setPlayingLine(-1);

        if (audioRef.played) {
          if (changeVolume) {
            audioRef.volume = oldVolume;
          }

          audioRef.pause();
        }
      }, (line.end - line.start) * 1000);
    }
  };

  const playRecordedLine = async (line: AudioLine) => {
    let recordAudio = new Audio(line.recordUrl);
    recordAudio.play();
  };

  const recordLine = (line: AudioLine) => {
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

        if (appStore.store.optionPlayLineWhileRecording) {
          playLine(line, true);
        }

        recorder = new MediaRecorder(stream);

        recorder.start(0);
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);

          if (recorder.state == "inactive") {
            setRecordingLine(-1);
            appStore.updateAudioLineRecord(line, chunks);
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

    for (let line of appStore.store.audioLines) {
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
            src={appStore.store.audioFileUrl}
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

          <Button onClick={() => appStore.useDemo("01")}>
            Use the demo audio file
          </Button>
        </div>
      </div>

      <div class="py-4">
        options:
        <input
          type="checkbox"
          onClick={appStore.updateOptionPlayLineWhileRecording}
          checked={appStore.store.optionPlayLineWhileRecording}
        />
        play which recording
        <Button onClick={saveRecord}>save records</Button>
      </div>

      {/* TODO: sticky top */}

      <div class="py-4">
        <For each={appStore.store.audioLines}>
          {(line) => (
            <div class={playingLine() == line.index ? "bg-blue-200" : ""}>
              {line.index + 1}. {line.text}
              <Button
                onClick={() => {
                  playLine(line);
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
