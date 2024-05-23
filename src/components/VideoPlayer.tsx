import { useService } from "@/service";
import { createSignal, JSXElement, onMount, Show } from "solid-js";

interface Props {
  src: string;
}

export default function VideoPlayer(props: Props): JSXElement {
  let service = useService();
  let videoRef: HTMLVideoElement;
  let [loadStatus, setLoadStatus] = createSignal<boolean>(); // null = unload, true = load, false = error
  let [isAudio, setIsAudio] = createSignal<boolean>();

  onMount(() => {
    videoRef.disablePictureInPicture = true;

    videoRef.addEventListener("loadedmetadata", () => {
      videoRef.playbackRate = service.store.options.playbackRate;
      // use the height to detect it is video or audio
      if (videoRef.videoHeight == 0) {
        // audio
        setIsAudio(true);
        videoRef.classList.add("hidden");
      }

      setLoadStatus(true);
    });

    videoRef.addEventListener("error", () => {
      setLoadStatus(false);
    });
  });

  return (
    <div class="flex flex-col">
      <div
        classList={{
          "self-center": !isAudio(),
          relative: !isAudio(),
        }}
      >
        <video
          class="max-h-80"
          ref={(ref) => {
            videoRef = ref;
            service.setMediaRef(ref);
          }}
          src={props.src}
          autoplay={false}
          controls={false}
        />

        <Show when={loadStatus() == true}>
          <Show when={isAudio() == true}>
            <div>
              <i class="fa-solid fa-music"></i> Audio
            </div>
          </Show>
        </Show>

        <Show when={loadStatus() == false}>
          <div class="absolute top-0 min-h-40 flex">
            <div class="place-self-center">
              Unavailable to load the audio or video
            </div>
          </div>
        </Show>

        <Show when={loadStatus() == null}>
          <div class="absolute top-0 min-h-40 flex">
            <div class="place-self-center">Loading</div>
          </div>
        </Show>
      </div>
    </div>
  );
}
