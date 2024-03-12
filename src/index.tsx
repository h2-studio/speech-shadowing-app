import { render } from "solid-js/web";

import "@/index.css";
import { ServiceProvider } from "@/service";
import App from "@/components/App";

const app = document.getElementById("app");

if (import.meta.env.DEV && !(app instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <ServiceProvider>
      <App />
    </ServiceProvider>
  ),
  app!
);
