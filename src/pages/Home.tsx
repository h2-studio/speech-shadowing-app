import { useService } from "@/service";
import { A } from "@solidjs/router";
import { JSXElement, Show } from "solid-js";

export default function Home(): JSXElement {
  let service = useService();

  return (
    <section class="m-10">
      <p class="text-title text-6xl">
        RECORD YOURSELF,
        <br />
        READ OUT LOUD,
        <br />
        AND REPEAT.
      </p>
      <p class="mt-5 text-2xl">
        Improve your spoken language with re.peat. <br />A speech shadowing app
        by H2 studio.
      </p>
      <p class="mt-5">
        <A href="/start" class="btn-primary">
          GET STARTED NOW <i class="fa-solid fa-play ms-2"></i>
        </A>
      </p>

      <Show when={import.meta.env.VITE_SHOW_DEMO}>
        <p class="mt-5">
          <button
            type="button"
            class="btn-primary"
            onClick={() => service.useDemo("audio")}
          >
            USE AUDIO DEMO
          </button>

          <button
            type="button"
            class="btn-primary ms-4"
            onClick={() => service.useDemo("video")}
          >
            USE VIDEO DEMO
          </button>
        </p>
      </Show>
    </section>
  );
}
