import { assign, createMachine, send } from "xstate";

export type BlockToolsContext = {
  visibleBlocks: Array<[key: string, entry: IntersectionObserverEntry['target']]>,
  currentBounds: Array<[key: string, rect: DOMRect]>,
  mouseY: number,
  currentBlock?: [key: string, target: DOMRect],
  observer?: IntersectionObserver
}
export type BlockToolsEvent = {
  type: 'SCROLLING'
} | {
  type: 'OBSERVER',
  observer: IntersectionObserver
} | {
  type: 'MOUSE.MOVE',
  mouseY: number
} | {
  type: 'ENTRY.OBSERVE',
  entry: HTMLElement
} | {
  type: 'ENTRY.ADD',
  id: string
  entry: IntersectionObserverEntry['target']
} | {
  type: 'ENTRY.DELETE',
  id: string
}

export var blockToolsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCMA2B7AxgawCrvVVgFkBDTACwEsA7MAOnIBcqA3MAYgGUBhAJQDyAGSEBJAHIBxRKAAO6WFRboaMkAA9EAVgDsAGhABPbQDYd9AAxWrAJhsAOewGYTTgL5uDaLHgJEylLQMzGycxAIAqlwAovThAGrRavKKyqpIGogmAJwW9ACMACy5Zjk6hTpOBsYI9tn29LlO+SYWzjqt+R5eGDj4hCTk1HT0tCHsoxConLyCIhLSGSlKVCpqmgg2+XmFJrtFJi35WtkO1Yg69iaWp4U2OhbZT9mX3SDefX6DgSNjmCwTKhTTjqWBMUhMYIAM0hACcABRaKwASg4H18AwCwwYfwBOOByQUKzWGQ2+Rs2XolQcZnKWkc+Xy51qOhs9BshWOOS0W0Z9Le6P6-iGQVGNHGDFgmFhhFQtCgHEJqVW6VAGzsDR0Wr5Vx0Wic2ScWmZDy09F0nKchQqNiNjwFvQxwp+nGi4lwfAAmvQAIIAET9SuJqsyCDMlMuLy0J0e9npJmZ9yclmsFkKLkczRcDp8Qu+2I4bo93r90SE0VwSSWRLS620Fny9D2NhMe0uTgbNkTrMaz21hsuhQsWhzn0xIrohfdXvoAgAQjE+Ikg7XSYhmmz6ntuUbnC1u5u+zp8gP7EOR553o681ighx54vEnwVyq6wh8kb6LsHJctOmKba3bJqmaYZnu2ZvDQ6AQHAaiCl8t4jBKkzTC+JJqlk+TmA8rbWr+lxtCauSNH+2StmRjx3IUo5OvmooSmhIYbCcyY4XsFRxgR9jMq4eTZKRdyHFsNE3hOOLiv8oQoWAjFvo4X45FY5JancFgtia2z0M0aakYaNhIjYIkIWJYrIVKMqoHKNBQLJa4IC4bJ3Ly1JbPYaYmo8BTppczi2hytpGeOLqmZJ7C2RhYaFApuSdipNhqQmRhZE4bIWjpWoUmRJiBc62LhaGThVEl9nHim1jkta-EWNlHhuEAA */
  createMachine({
    context: {
      visibleBlocks: [],
      currentBounds: [],
      mouseY: 0,
      currentBlock: undefined,
      observer: undefined,
    },
    tsTypes: {} as import("./block-tools-machine.typegen").Typegen0,
    schema: { context: {} as BlockToolsContext, events: {} as BlockToolsEvent },
    invoke: [
      {
        src: "visibilityObserver",
        id: "visibilityObserver",
      },
      {
        src: "scrollListener",
        id: "scrollListener",
      },
      {
        src: "mouseListener",
        id: "mouseListener",
      },
    ],
    id: "blockToolsMachine",
    initial: "inactive",
    states: {
      active: {
        entry: ["getBlockBounds", "assignCurrentBlock"],
        initial: "idle",
        states: {
          idle: {},
        },
        on: {
          SCROLLING: {
            target: "inactive",
          },
          "MOUSE.MOVE": {
            actions: ["assignMousePosition", "assignCurrentBlock"],
          },
        },
      },
      inactive: {
        initial: "idle",
        states: {
          idle: {
            after: {
              "500": {
                actions: "assignMousePosition",
                target: "#blockToolsMachine.active.idle",
              },
            },
            on: {
              SCROLLING: {
                target: "scrolling",
              },
            },
          },
          scrolling: {
            always: {
              target: "idle",
            },
          },
        },
      },
    },
    on: {
      "ENTRY.ADD": {
        actions: "addEntry",
      },
      "ENTRY.DELETE": {
        actions: "removeEntry",
      },
      "ENTRY.OBSERVE": {
        actions: "observeNode",
      },
      OBSERVER: {
        actions: "assignObserver",
      },
    },
  }, {
    actions: {
      addEntry: assign({
        visibleBlocks: (context, event) => {
          let tMap = new Map(context.visibleBlocks)
          tMap.set(event.id, event.entry)
          return [...tMap]
        }
      }),
      removeEntry: assign({
        visibleBlocks: (context, event) => {
          let tMap = new Map(context.visibleBlocks)
          tMap.delete(event.id)
          return [...tMap]
        }
      }),
      observeNode: (context, event) => {
        console.log('observeNode', context, event)
        context.observer?.observe(event.entry)
      },
      getBlockBounds: assign({
        currentBounds: (context) => {

          let newBounds = new Map()
          context.visibleBlocks.forEach(([key, entry]) => {
            newBounds.set(key, entry.getBoundingClientRect())
          })

          return [...newBounds]
        }
      }),
      assignObserver: assign({
        observer: (_, event) => event.observer
      }),
      assignMousePosition: assign({
        mouseY: (_, event) => {
          return event.mouseY
        }
      }),
      assignCurrentBlock: assign({
        currentBlock: (context) => {
          let match: [key: string, rect: DOMRect] = []

          for (const [key, rect] of context.currentBounds) {
            let top = rect.y
            let bottom = rect.y + rect.height

            if (context.mouseY > top && context.mouseY < bottom) {
              match = [key, rect]
            }
          }

          return match
        }
      }),
    },
    services: {
      mouseListener: () => (sendBack) => {
        function onMouseMove(event: MouseEvent) {
          sendBack({ type: 'MOUSE.MOVE', mouseY: event.clientY })
        }
        window.addEventListener('mousemove', onMouseMove)

        return () => {
          window.removeEventListener('mousemove', onMouseMove)
        }
      },
      scrollListener: () => (sendBack) => {
        function onScroll() {
          sendBack('SCROLLING')
        }

        window.addEventListener('scroll', onScroll)

        return () => {
          window.removeEventListener('scroll', onScroll)
        }
      },
      visibilityObserver: () => (sendBack) => {
        function callback(entries: Array<IntersectionObserverEntry>, observer: IntersectionObserver) {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              // console.log('IS INTERSECTING!', entry.target.dataset.parentId)
              sendBack({ type: 'ENTRY.ADD', id: entry.target.dataset.parentId, entry: entry.target })
            } else {
              // console.log('NOT INTERSECTING!', entry.target.dataset.parentId)
              sendBack({ type: 'ENTRY.DELETE', id: entry.target.dataset.parentId })
            }
          }
        }
        let options = {
          threshold: [0.33, 0.66]
        }
        let observer = new IntersectionObserver(callback, options)
        sendBack({ type: 'OBSERVER', observer })

        return () => {
          observer.disconnect()
        }
      }
    }
  })