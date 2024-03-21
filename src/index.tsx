import "@/index.css";

import { render } from "solid-js/web";

import { Home, Practice, Resource, Root, Start } from "@/pages";
import { ServiceProvider } from "@/service";
import { HashRouter, Route } from "@solidjs/router";

const app = document.getElementById("app");

if (import.meta.env.DEV && !(app instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <ServiceProvider>
      <HashRouter root={Root}>
        <Route path="/" component={Home} />
        <Route path="/Start" component={Start} />
        <Route path="/practice" component={Practice} />
        <Route path="/resource" component={Resource} />
      </HashRouter>
    </ServiceProvider>
  ),
  app!
);
