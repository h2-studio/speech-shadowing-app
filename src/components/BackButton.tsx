import { ParentProps, JSXElement } from "solid-js";

interface Props {
  onClick: () => void;
}

export default function BackButton(props: ParentProps<Props>): JSXElement {
  return (
    <button
      type="button"
      title="the back button"
      class="text-5xl text-gray-300 hover:text-gray-500"
      onClick={props.onClick}
    >
      <i class="fa-solid fa-circle-arrow-left "></i>
    </button>
  );
}
