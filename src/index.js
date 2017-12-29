import { createCollection, defaultCompare, defaultTransform } from './utils'

const WATCH = '@@eagle/WATCH'
const UNWATCH = '@@eagle/UNWATCH'

export function watch(selectors, listener, compare = defaultCompare) {
  let payload = { selectors, listener, compare }
  let partial = createPartial(WATCH, payload)
  return listener ? partial(listener, compare) : partial
}

export function unwatch(selectors, listener) {
  let payload = { selectors, listener }
  let partial = createPartial(UNWATCH, payload)
  return listener ? partial(listener) : partial
}

function createPartial(type, payload) {
  return (specifiers, listener, compare = defaultCompare) => {
    if (typeof specifiers === 'function') {
      listener = specifiers
      specifiers = undefined
    }
    payload = { ...payload, specifiers, listener }
    return { type, payload }
  }
}

export function createEagle(selectorTransform = defaultTransform) {
  const subscribers = createCollection()

  function mapSelectors(selectors, specifiers, fn) {
    selectors = [].concat(selectors)
    return selectors.map((selector, index) => {
      selector = selectorTransform(selector, specifiers, index)
      return fn(selector)
    })
  }

  return store => nextDispatch => action => {
    switch (action.type) {
      case WATCH: {
        let { selectors, specifiers, listener, compare } = action.payload
        return mapSelectors(selectors, specifiers, selector =>
          subscribers.getOrInsert({ selector, listener, compare })
        )
      }
      case UNWATCH: {
        let { selectors, specifiers, listener } = action.payload
        return mapSelectors(selectors, specifiers, selector =>
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
