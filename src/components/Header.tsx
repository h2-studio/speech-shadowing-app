import { JSXElement } from "solid-js";

export default function Header(): JSXElement {
  return (
    <header class="bg-black">
      <div class="h-20 max-w-screen-lg mx-2 lg:mx-auto flex relative">
        <a href="/" class="logo text-4xl self-center">
          RE:PEAT
        </a>
        <span class="self-center absolute right-0 ">
          <a
            href="https://github.com/h2-studio/repeat-app"
            target="_black"
            class="text-3xl text-white"
          >
            <i class="fa-brands fa-github"></i>
          </a>
        </span>
      </div>
    </header>
  );
}
