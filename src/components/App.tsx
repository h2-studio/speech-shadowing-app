import { JSXElement, Match, Switch, onMount } from "solid-js";

import { useService } from "@/service";

import PracticePanel from "./StartPanel";
import Header from "./Header";
import PlayerPanel from "./PracticePanel";

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
    </>
  );
}
