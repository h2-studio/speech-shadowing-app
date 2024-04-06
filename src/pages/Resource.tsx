import {
  createSignal,
  For,
  JSXElement,
  Match,
  onMount,
  Switch,
} from "solid-js";

import BackButton from "@/components/BackButton";
import { useService } from "@/service";

export default function Resource(): JSXElement {
  let service = useService();
  let [isLoading, setIsLoading] = createSignal(false);
  let [selectedCategory, setSelectedCategory] =
    createSignal<ResourceCategory>();

  onMount(() => {
    if (service.store.categories == null) {
      setIsLoading(true);
      service.loadResourceCategories().finally(() => {
        setIsLoading(false);
      });
    }
  });

  let onSelectCategory = async (category: ResourceCategory) => {
    if (category.resources == null) {
      setIsLoading(true);

      service.loadResources(category).finally(() => {
        setIsLoading(false);
        setSelectedCategory(category);
      });
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <>
      <div class="my-10">
        <BackButton
          onClick={() => {
            if (selectedCategory()) {
              setSelectedCategory(null);
            } else {
              service.navToStart();
            }
          }}
        />
      </div>

      <Switch>
        <Match when={isLoading()}>Loading...</Match>
        {/* for resources */}
        <Match when={selectedCategory() != null}>
          <div>
            <div>{selectedCategory().title} </div>
            <div class="grid grid-cols-2">
              {/* TODO: use fetch more */}
              <For each={selectedCategory().resources}>
                {(item) => (
                  <div
                    class="border border-gray-600 p-6 m-1 hover:bg-gray-600"
                    onClick={() => {
                      service.navToPractice(
                        item.sourceUrl,
                        item.subtitleUrl ?? item.subtitlePath
                      );
                    }}
                  >
                    type: {item.type}
                    <br />
                    title: {item.title}
                    <br />
                    duration: {item.duration}
                    <br />
                    release date: {item.releasedDate}
                    <br />
                    last practice date: TODO
                  </div>
                )}
              </For>
            </div>
          </div>
        </Match>

        {/* for categories */}
        <Match when={selectedCategory() == null}>
          <div class="text-lg">select a category:</div>
          <div class="grid grid-cols-2">
            <For each={service.store.categories}>
              {(category) => (
                <div
                  class="border border-gray-600 p-6 m-1 hover:bg-gray-600"
                  onclick={() => {
                    onSelectCategory(category);
                  }}
                >
                  {category.title}
                </div>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </>
  );
}
