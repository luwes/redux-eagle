import { createCollection, defaultCompare, defaultTransform } from './utils'

const WATCH = '@@eagle/WATCH'
const UNWATCH = '@@eagle/UNWATCH'

export function watch(store, selectors, listener, compare = defaultCompare) {
  return store.dispatch({
    type: WATCH,
    payload: { selectors, listener, compare }
  })
}

export function unwatch(store, selectors, listener) {
  return store.dispatch({
    type: UNWATCH,
    payload: { selectors, listener }
  })
}

export function createEagle(selectorTransform = defaultTransform) {
  const subscribers = createCollection()

  function mapSelectors(selectors, fn) {
    selectors = [].concat(selectors)
    return selectors.map(selector => {
      selector = selectorTransform(selector)
      return fn(selector)
    })
  }

  return store => nextDispatch => action => {
    switch (action.type) {
      case WATCH: {
        let { selectors, listener, compare } = action.payload
        return mapSelectors(selectors, selector =>
          subscribers.getOrInsert({ selector, listener, compare })
        )
      }
      case UNWATCH: {
        let { selectors, listener } = action.payload
        return mapSelectors(selectors, selector =>
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
