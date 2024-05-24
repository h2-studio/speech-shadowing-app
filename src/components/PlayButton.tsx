import { JSXElement } from "solid-js";

interface Props {
  playIcon?: string;
  stopIcon?: string;
  isPlaying: boolean;
  isDisabled?: boolean;
  text: string;
  title: string;
  onClick: () => void;
}

export default function PlayButton(props: Props): JSXElement {
  let playIcon = props.playIcon ?? "fa-circle-play";
  let stopIcon = props.stopIcon ?? "fa-circle-pause";

  return (
    <button
      type="button"
      title={props.title}
      class="w-24 hover:text-gray-500 disabled:text-gray-300"
      disabled={props.isDisabled}
      onClick={props.onClick}      
    >
      <i
        class="block text-4xl fa-solid"
        classList={{
          [playIcon]: !props.isPlaying,
          [stopIcon]: props.isPlaying,
        }}
      ></i>
      {props.text}
    </button>
  );
}
