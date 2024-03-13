import { JSXElement, Match, onMount, Switch } from "solid-js";
import { Toaster } from "solid-toast";

import { useService } from "@/service";

import Header from "./Header";
import PlayerPanel from "./PracticePanel";
import PracticePanel from "./StartPanel";

export default function App(): JSXElement {
  let service = useService();

  onMount(() => {
    // check the url
    let query = new URLSearchParams(location.search);

    if (query.has("sourceUrl") && query.has("subtitleUrl")) {
      service.startPractice(
        query.get("type") == "video",
        query.get("sourceUrl"),
        query.get("subtitleUrl")
      );
    }
  });

  return (
    <>
      <Header />
      <Switch fallback={<PracticePanel />}>
        <Match when={service.store.isReady}>
          <PlayerPanel />
        </Match>
      </Switch>
      <Toaster />
    </>
  );
}
