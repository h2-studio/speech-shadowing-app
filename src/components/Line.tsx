import { JSXElement, Show } from "solid-js";

import { useService } from "@/service";

import Button from "./Button";

interface LineProps {
  line: SubtitleLine;
}

export default function Line(props: LineProps): JSXElement {
  let service = useService();
  let line = props.line;

  return (
    <div class={line.isPlaying ? "bg-blue-200" : ""}>
      {line.index + 1}. {line.text}
      <Button
        onClick={() => {
          service.playLine(line);
        }}
      >
        play
      </Button>
      <Show when={!line.isRecording}>
        <Button
          onClick={() => {
            service.recordLine(line);
          }}
        >
          record
        </Button>
      </Show>
      <Show when={line.isRecording}>
        <Button
          type="alert"
          onClick={() => {
            service.stopRecordLine();
          }}
        >
          stop
        </Button>
      </Show>
      <Show when={line.recordBlobUrl}>
        <Button
          onClick={() => {
            service.playLineRecord(line);
          }}
        >
          play record
        </Button>
      </Show>
    </div>
  );
}
