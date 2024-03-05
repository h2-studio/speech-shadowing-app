import { Component, For } from "solid-js";
import appStore from "../stores";
import { Cue } from "simple-subtitle-parser";

const App: Component = () => {
  let audio: HTMLAudioElement;
  let audioFileInput: HTMLInputElement;
  let audioSubFileInput: HTMLInputElement;

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

  const playCue = async (cue: Cue) => {
    let start = cue.startTime.totals.inSeconds;
    let end = cue.endTime.totals.inSeconds;

    audio.currentTime = start;

    if (audio.paused) {
      await audio.play();

      setTimeout(() => {
        if (audio.played) {
          audio.pause();
        }
      }, (end - start) * 1000);
    }
  };

  return (
    <>
      <h1>Speech Shadowing App</h1>
      <div>
        <audio
          ref={(ref) => (audio = ref)}
          src={appStore.store.audioFileSrc}
          controls
          autoplay={false}
        />
        <input
          ref={(ref) => (audioFileInput = ref)}
          type="file"
          style="display:none"
          accept=".mp3"
          onchange={onAudioFileSelected}
        />
        <button
          type="button"
          onClick={() => {
            audioFileInput.click();
          }}
        >
          Select an audio file
        </button>
      </div>
      <div>
        <input
          ref={(ref) => (audioSubFileInput = ref)}
          type="file"
          style="display:none"
          accept=".srt"
          onchange={onAudioSubFileSelected}
        />
        <button
          type="button"
          onClick={() => {
            audioSubFileInput.click();
          }}
        >
          Select an audio subtitle file
        </button>
      </div>
      <div>
        <For each={appStore.store.audioSubCues}>
          {(cue, i) => (
            <div onClick={() => playCue(cue)}>
              {cue.sequence + 1}. {cue.text}
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default App;
