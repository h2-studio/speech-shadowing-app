import { A } from "@solidjs/router";
import { JSXElement } from "solid-js";

export default function Home(): JSXElement {
  return (
    <section>
      <p class="mt-20 font-title text-7xl">
        RECORD YOURSELF,
        <br />
        READ OUT LOUD,
        <br />
        AND REPEAT.
      </p>
      <p class="mt-5 text-3xl">
        Improve your spoken language with Re:peat. <br />A speech shadowing app
        by H2 studio.
      </p>
      <p class="mt-14">
        <A href="/start" class="btn-primary text-2xl p-4">GET STARTED NOW <i class="fa-solid fa-play mx-2"></i></A>
      </p>
    </section>
  );
}
