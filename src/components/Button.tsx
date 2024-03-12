import { ParentProps, JSXElement } from "solid-js";

interface Props {
  type?: "primary" | "alert";
  class?: string;
  onClick?: () => void;
}

export default function Button(props: ParentProps<Props>): JSXElement {
  let cssClasses = ["p-1", "underline"];

  switch (props.type) {
    case "alert":
      cssClasses.push("text-red-300");
      break;
    case "primary":
    default:
      break;
  }

  if (props.class) {
    cssClasses.push(props.class);
  }

  return (
    <button type="button" class={cssClasses.join(" ")} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
