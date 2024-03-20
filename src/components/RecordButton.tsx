import { createEffect, JSXElement } from "solid-js";

interface RecordButtonProps {
  domainData: number[];
  isRecording: boolean;
  onClick: () => void;
}

export default function RecordButton(props: RecordButtonProps): JSXElement {
  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  createEffect(() => {
    let domainData = props.domainData;

    let ctx = canvas.getContext("2d");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.clearRect(0, 0, canvas.height, canvas.width);

    if (props.isRecording && domainData != null) {
      // draw domainData

      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;

      let xWidth = canvas.width / domainData.length;
      let x = 0;
      let yCenter = canvas.height / 2;

      for (let d of domainData) {
        let y = (d / 128.0) * yCenter;

        ctx.lineTo(x, y);

        x += xWidth;
      }

      ctx.lineTo(canvas.width, yCenter);
      ctx.stroke();
    }
  });

  return (
    <button
      title={(props.isRecording ? "stop" : "start") + " recording (Enter, Q)"}
      type="button"
      class="size-40 p-2 border-2 rounded-full"
      classList={{
        "border-red-500": !props.isRecording,
        "hover:border-red-800": !props.isRecording,
        "border-blue-500": props.isRecording,
        "hover:border-blue-800": props.isRecording,
      }}
      onClick={props.onClick}
    >
      <div
        ref={container}
        class="size-full rounded-full overflow-hidden"
        classList={{
          "bg-red-500": !props.isRecording,
          "hover:bg-red-800": !props.isRecording,
          "bg-blue-500": props.isRecording,
          "hover:bg-blue-800": props.isRecording,
        }}
      >
        <canvas ref={canvas} />
      </div>
    </button>
  );
}
