import { Component, For, Show, createSignal } from "solid-js";
import Crunker from "crunker";
import appStore from "../stores";

const App: Component = () => {
  let audioRef: HTMLAudioElement;
  let audioFileInputRef: HTMLInputElement;
  let audioSubFileInputRef: HTMLInputElement;
  let downloadLinkRef: HTMLAnchorElement;

  let recorder: MediaRecorder;

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

  const playLine = async (line: AudioLine) => {
    audioRef.currentTime = line.start;

    if (audioRef.paused) {
      await audioRef.play();

      setTimeout(() => {
        if (audioRef.played) {
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
          playLine(line);
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
      <h1>Speech Shadowing App</h1>
      <div>
        <audio
          ref={(ref) => (audioRef = ref)}
          src={appStore.store.audioFileUrl}
          controls
          autoplay={false}
        />
        <button
          type="button"
          onClick={() => {
            audioFileInputRef.click();
          }}
        >
          Select an audio file
        </button>

        <button
          type="button"
          onClick={() => {
            audioSubFileInputRef.click();
          }}
        >
          Select an audio subtitle file
        </button>

        <button type="button" onClick={() => appStore.useDemo("01")}>
          Use the demo audio file
        </button>
      </div>

      <div>
        options:
        <input
          type="checkbox"
          onClick={appStore.updateOptionPlayLineWhileRecording}
          checked={appStore.store.optionPlayLineWhileRecording}
        />
        play which recording
        <button onclick={saveRecord}>save records</button>
      </div>
      <div>
        <For each={appStore.store.audioLines}>
          {(line) => (
            <div>
              {line.index + 1}. {line.text}
              <button
                type="button"
                onClick={() => {
                  playLine(line);
                }}
              >
                play
              </button>
              {recordingLine() == line.index ? (
                <button
                  type="button"
                  style={{ background: "red" }}
                  onClick={() => {
                    stopRecordLine();
                  }}
                >
                  stop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    recordLine(line);
                  }}
                >
                  record
                </button>
              )}
              <Show when={line.recordUrl}>
                <button
                  type="button"
                  onClick={() => {
                    playRecordedLine(line);
                  }}
                >
                  play record
                </button>
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
};

export default App;
