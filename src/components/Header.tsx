import { JSXElement } from "solid-js";

export default function Header(): JSXElement {
  return (
    <header class="bg-black">
      <div class="h-20 max-w-screen-lg lg:mx-auto px-2 flex relative">
        <a href="/" class="logo text-4xl self-center">
          <img src="/logo.png"/>
        </a>
        <span class="self-center absolute right-2 ">
          <a
            href="https://github.com/team-h2/repeat-app"
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
