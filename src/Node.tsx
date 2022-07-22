import { useEffect, useMemo, useRef } from "react";
import { SendAction, Sender } from "xstate";
import { BlockToolsEvent, blockToolsMachine } from "./block-tools-machine";

type NodeProps = {
  element: string;
  children: Array<NodeProps>;
  id?: string;
  type?: string;
  text?: string;
  send: Sender<BlockToolsEvent>;
};

export function Node(props: NodeProps) {
  let { element, children, id, type, text, parentId, send } = props;
  let ref = useRef<HTMLElement>(null);

  let Component = element;

  let attributes = useMemo(
    () =>
      type
        ? { "data-block-id": id, "data-element-type": type }
        : parentId
        ? { "data-parent-id": parentId }
        : {},
    [type, id]
  );

  useEffect(() => {
    if (ref.current) {
      if (element == "p" || element == "h1") {
        send({ type: "ENTRY.OBSERVE", entry: ref.current });
      }
    }
  }, [ref.current]);

  return (
    <Component {...attributes} ref={ref}>
      {children
        ? children.map((n: any, i) => (
            <Node key={`elm-${i}`} {...n} send={send} />
          ))
        : text}
    </Component>
  );
}
