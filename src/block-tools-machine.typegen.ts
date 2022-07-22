// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    addEntry: "ENTRY.ADD";
    removeEntry: "ENTRY.DELETE";
    observeNode: "ENTRY.OBSERVE";
    assignObserver: "OBSERVER";
    assignMousePosition:
      | "MOUSE.MOVE"
      | "xstate.after(500)#blockToolsMachine.inactive.idle";
    assignCurrentBlock: "MOUSE.MOVE";
    getBlockBounds: "xstate.init";
  };
  internalEvents: {
    "xstate.after(500)#blockToolsMachine.inactive.idle": {
      type: "xstate.after(500)#blockToolsMachine.inactive.idle";
    };
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
    "done.invoke.visibilityObserver": {
      type: "done.invoke.visibilityObserver";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.visibilityObserver": {
      type: "error.platform.visibilityObserver";
      data: unknown;
    };
    "done.invoke.scrollListener": {
      type: "done.invoke.scrollListener";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.scrollListener": {
      type: "error.platform.scrollListener";
      data: unknown;
    };
    "done.invoke.mouseListener": {
      type: "done.invoke.mouseListener";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.mouseListener": {
      type: "error.platform.mouseListener";
      data: unknown;
    };
  };
  invokeSrcNameMap: {
    visibilityObserver: "done.invoke.visibilityObserver";
    scrollListener: "done.invoke.scrollListener";
    mouseListener: "done.invoke.mouseListener";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    visibilityObserver: "xstate.init";
    scrollListener: "xstate.init";
    mouseListener: "xstate.init";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "active"
    | "active.idle"
    | "inactive"
    | "inactive.idle"
    | "inactive.scrolling"
    | { active?: "idle"; inactive?: "idle" | "scrolling" };
  tags: never;
}
