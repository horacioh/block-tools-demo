import { useMachine } from "@xstate/react";
import { blockToolsMachine } from "./block-tools-machine";
import { data } from "./data";
import { Node } from "./Node";

export function App() {
  let [state, send] = useMachine(() => blockToolsMachine);
  return (
    <main>
      <span
        style={{
          position: "fixed",
          zIndex: 10,
          top: 20,
          right: 20,
          padding: 12,
          background: "white",
        }}
      >
        {JSON.stringify(state.value)}
      </span>
      <ul>
        {data.map((n) => (
          <Node key={n.id} {...n} send={send} />
        ))}
      </ul>
      <div
        className="block-tools"
        style={
          state.context.currentBlock?.length
            ? {
                "--tools-x": state.context.currentBlock[1].x,
                "--tools-y": state.context.currentBlock[1].y,
                opacity: state.matches("active") ? 1 : 0,
              }
            : {
                opacity: state.matches("active") ? 1 : 0,
              }
        }
      />
    </main>
  );
}
