import { createSignal, JSXElement, onMount, Show } from "solid-js";

import { useService } from "@/service";

interface Props {
  resource: Resource;
}

export default function ResourceCard(props: Props): JSXElement {
  let service = useService();
  let { resource: res } = props;

  let [practiceTime, setPracticeTime] = createSignal("None");

  onMount(async () => {
    let record = await service.getPracticeRecord(res.subtitleUrl);

    if (record) {
      // TODO: use time ago
      setPracticeTime(record.practicedAt.toLocaleString());
    }
  });

  return (
    <div
      class="border border-gray-600 p-6 m-1 hover:bg-gray-600 cursor-pointer"
      onClick={() => {
        service.navToPractice(res.sourceUrl, res.subtitleUrl);
      }}
    >
      type: {res.type}
      <br />
      title: {res.title}
      <br />
      duration: {res.duration}
      <br />
      release date: {res.releasedDate}
      <br />
      last practice date: {practiceTime()}
      <br />
      <Show when={res.from}>
        <a
          class="default"
          href={res.from}
          target="_blank"
          onclick={(e) => {
            e.stopImmediatePropagation();
          }}
        >
          Original Webpage
        </a>
      </Show>
    </div>
  );
}
