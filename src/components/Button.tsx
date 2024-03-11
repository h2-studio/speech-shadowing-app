import { ParentProps, JSXElement } from "solid-js";

interface Props {
  type?: "primary" | "alert";
  onClick?: () => void;
}

export default function Button(props: ParentProps<Props>): JSXElement {  
  let color: string;

  switch (props.type) {
    case "alert":
      color = "text-red-300";
      break;
    case "primary":
    default:
      color = "";
      break;
  }

  return (
    <button type="button" class={color + " p-1 underline"} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
