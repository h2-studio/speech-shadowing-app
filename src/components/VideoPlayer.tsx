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
      setIsAudio(videoRef.videoHeight == 0);
      setLoadStatus(true);
    });

    videoRef.addEventListener("error", () => {
      setLoadStatus(false);
    });
  });

  return (
    <div
      class="box flex flex-col"
      classList={{
        hidden: isAudio(),
      }}
    >
      <div class="self-center relative">
        <video
          class="max-h-80"
          ref={(ref) => {
            videoRef = ref;
            service.setMediaRef(ref);
          }}
          src={props.src}
          autoplay={false}
          controls={false}
          playsinline
        />

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
