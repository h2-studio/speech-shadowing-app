import { A } from "@solidjs/router";
import { JSXElement } from "solid-js";

export default function Home(): JSXElement {
  return (
    <section class="m-10">
      <p class="font-title text-6xl">
        RECORD YOURSELF,
        <br />
        READ OUT LOUD,
        <br />
        AND REPEAT.
      </p>
      <p class="mt-5 text-2xl">
        Improve your spoken language with Re:peat. <br />A speech shadowing app
        by H2 studio.
      </p>
      <p class="mt-5">
        <A href="/start" class="btn-primary">GET STARTED NOW <i class="fa-solid fa-play ms-2"></i></A>
      </p>
    </section>
  );
}
