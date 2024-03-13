import {
  createEffect, createResource, createSignal, For, JSXElement, Match, Show, Switch
} from "solid-js";

import { ResourceJsonUrl, ResourceRepoUrl } from "@/const";
import { useService } from "@/service";

export default function Resource(): JSXElement {
  let service = useService();
  let [resourceJson] = createResource<ResourceList>(async () =>
    (await fetch(ResourceJsonUrl)).json()
  );

  let [categories, setCategories] = createSignal<string[]>();
  let [category, setCategory] = createSignal<string>();

  createEffect(() => {
    let json = resourceJson();

    if (json != null) {
      setCategories([...Object.getOwnPropertyNames(json)]);
    }
  });

  return (
    <>
      <Show when={resourceJson.loading}>Loading resource list</Show>
      <Switch>
        <Match when={category() != null}>
          <div>
            <div>
              {category()}{" "}
              <button
                type="button"
                class="underline hover:text-gray-700"
                onClick={() => {
                  setCategory(null);
                }}
              >
                back
              </button>
            </div>
            <For each={resourceJson()[category()]}>
              {(item) => (
                <div
                  class="hover:bg-gray-500 p-6"
                  onClick={() => {
                    let url = item.subtitlePath
                      ? `${ResourceRepoUrl}/${item.subtitlePath}`
                      : item.subtitleUrl;

                    service.startPractice(
                      item.type == "video",
                      item.sourceUrl,
                      url
                    );
                  }}
                >
                  type: {item.type}
                  <br />
                  title: {item.title}
                  <br />
                  duration: {item.duration}
                </div>
              )}
            </For>
          </div>
        </Match>
        <Match when={categories() != null}>
          <div class="text-lg">select a category:</div>
          <div class="columns-2 mt-5">
            <For each={categories()}>
              {(item) => (
                <div
                  class="border border-gray-600 p-6 hover:bg-gray-600"
                  onclick={() => {
                    setCategory(item);
                  }}
                >
                  {item}
                </div>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </>
  );
}
