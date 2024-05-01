import { useService } from "@/service";
import { formatTime } from "@/utils/duration";
import { createSignal, JSXElement, onCleanup, onMount, Show } from "solid-js";

interface Props {
  src: string;
}

interface VideoInfo {
  duration: string;
}

export default function VideoPlayer(props: Props): JSXElement {
  let service = useService();
  let videoRef: HTMLVideoElement;
  let [loadStatus, setLoadStatus] = createSignal<boolean>(); // null = unload, true = load, false = error
  let [durationStr, setDurationStr] = createSignal<string>();

  onMount(() => {
    videoRef.disablePictureInPicture = true;

    videoRef.addEventListener("loadedmetadata", () => {
      videoRef.playbackRate = service.store.options.playbackRate;
      // use the height to detect it is video or audio
      if (videoRef.videoHeight == 0) {
        // audio
        videoRef.classList.add("max-h-10");
        videoRef.classList.remove("max-h-80");
        videoRef.controls = true;
      } else {
        // video
        videoRef.classList.add("max-h-80");
        videoRef.classList.remove("max-h-10");
        videoRef.controls = false;
      }

      // setVideoInfo({
      //   duration: videoRef.duration,
      // });

      setDurationStr(formatTime(videoRef.duration));
      setLoadStatus(true);
    });

    videoRef.addEventListener("error", () => {
      setLoadStatus(false);
    });
  });

  return (
    <div class="flex flex-col">
      <div class="self-center relative">
        <video
          class="max-h-80"
          ref={(ref) => {
            videoRef = ref;
            service.setMediaRef(ref);
          }}
          src={props.src}
          autoplay={false}
        />
        <Show when={loadStatus() == true}>
          <div>{durationStr()}</div>
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
