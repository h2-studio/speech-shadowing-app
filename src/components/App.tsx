import { Component, For, createSignal } from "solid-js";
import appStore from "../stores";

const App: Component = () => {
  let audio: HTMLAudioElement;
  let audioFileInput: HTMLInputElement;
  let audioSubFileInput: HTMLInputElement;
  let [recordingLine, setRecordingLine] = createSignal(-1);

  const onAudioFileSelected = (e: Event) => {
    if (audioFileInput.files != null) {
      appStore.updateAudioFile(audioFileInput.files[0]);
    }
  };

  const onAudioSubFileSelected = (e: Event) => {
    if (audioSubFileInput.files != null) {
      appStore.updateAudioSubFile(audioSubFileInput.files[0]);
    }
  };

  const playLine = async (line: AudioLine) => {
    audio.currentTime = line.start;

    if (audio.paused) {
      await audio.play();

      setTimeout(() => {
        if (audio.played) {
          audio.pause();
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
      .then((media) => {
        setRecordingLine(line.index);

        let chunks = [] as Blob[];

        if (appStore.store.optionPlayLineWhileRecording) {
          playLine(line);
        }

        let recorder = new MediaRecorder(media);

        recorder.start(0);
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        // TODO: better stop
        setTimeout(() => {
          setRecordingLine(-1);

          recorder.stop();
          media.getTracks().forEach((track) => track.stop());

          appStore.updateAudioLineRecord(line, new Blob(chunks));
        }, (line.end - line.start + 1) * 1000);
      });
  };

  return (
    <>
      <h1>Speech Shadowing App</h1>
      <div>
        <input
          ref={(ref) => (audioFileInput = ref)}
          type="file"
          style="display:none"
          accept=".mp3"
          onchange={onAudioFileSelected}
        />
        <input
          ref={(ref) => (audioSubFileInput = ref)}
          type="file"
          style="display:none"
          accept=".srt"
          onchange={onAudioSubFileSelected}
        />

        <audio
          ref={(ref) => (audio = ref)}
          src={appStore.store.audioFileUrl}
          controls
          autoplay={false}
        />
        <button
          type="button"
          onClick={() => {
            audioFileInput.click();
          }}
        >
          Select an audio file
        </button>

        <button
          type="button"
          onClick={() => {
            audioSubFileInput.click();
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
              <button
                type="button"
                style={{
                  background: recordingLine() == line.index ? "red" : "",
                }}
                onClick={() => {
                  recordLine(line);
                }}
              >
                {recordingLine() == line.index ? "stop" : "record"}
              </button>
              <button
                type="button"
                onClick={() => {
                  playRecordedLine(line);
                }}
              >
                play record
              </button>
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default App;
