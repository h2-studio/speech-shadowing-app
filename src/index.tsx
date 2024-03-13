import "@/index.css";

import { render } from "solid-js/web";

import { ServiceProvider } from "@/service";
import { MemoryRouter, Route } from "@solidjs/router";

import Practice from "./pages/Practice";
import Resource from "./pages/Resource";
import Root from "./pages/Root";
import Start from "./pages/Start";

const app = document.getElementById("app");

if (import.meta.env.DEV && !(app instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <ServiceProvider>
      <MemoryRouter root={Root}>
        <Route path="/" component={Start} />
        <Route path="/practice" component={Practice} />
        <Route path="/resource" component={Resource} />
      </MemoryRouter>
    </ServiceProvider>
  ),
  app!
);
