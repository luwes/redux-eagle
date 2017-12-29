import { createCollection, defaultCompare } from './utils'

const WATCH = '@@eagle/WATCH'
const UNWATCH = '@@eagle/UNWATCH'

export function watch(selectors, listener, compare = defaultCompare) {
  return {
    type: WATCH,
    payload: { selectors, listener, compare }
  }
}

export function unwatch(selectors, listener) {
  return {
    type: UNWATCH,
    payload: { selectors, listener }
  }
}

export function createEagle() {
  const subscribers = createCollection()

  return store => nextDispatch => action => {
    switch (action.type) {
      case WATCH: {
        let { selectors, listener, compare } = action.payload
        selectors = [].concat(selectors)
        return selectors.map(selector =>
          subscribers.getOrInsert({ selector, listener, compare })
        )
      }
      case UNWATCH: {
        let { selectors, listener } = action.payload
        selectors = [].concat(selectors)
        return selectors.map(selector =>
          subscribers.remove({ selector, listener })
        )
      }
      default: {
        const prevState = store.getState()
        const result = nextDispatch(action)
        const nextState = store.getState()

        const list = subscribers.get()
        for (let i = 0; i < list.length; i++) {
          const { selector, listener, compare } = list[i]
          const prev = selector(prevState)
          const next = selector(nextState)
          if (!compare(prev, next)) {
            listener(next, prev, nextState)
          }
        }

        return result
      }
    }
  }
}

// export default function eagle(store) {
//     return createEagle()(store);
// }
