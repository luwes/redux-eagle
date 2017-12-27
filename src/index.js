import { createCollection } from './utils'

const WATCH = '@@observer/WATCH'
const UNWATCH = '@@observer/UNWATCH'

export function watch(store, selectors, listener) {
  return store.dispatch({
    type: WATCH,
    payload: { selectors, listener }
  })
}

export function unwatch(store, selectors, listener) {
  return store.dispatch({
    type: UNWATCH,
    payload: { selectors, listener }
  })
}

export function createObserver(...selectorTransforms) {
  const subscribers = createCollection()

  function mapSelectors(selectors, fn) {
    selectors = [].concat(selectors)
    return selectors.map(selector =>
      fn(
        selectorTransforms.reduce(
          (acc, transform) => transform(selector),
          selector
        )
      )
    )
  }

  return store => nextDispatch => action => {
    switch (action.type) {
      case WATCH: {
        let { selectors, listener } = action.payload
        return mapSelectors(selectors, selector => {
          return subscribers.getOrInsert({ selector, listener })
        })
      }
      case UNWATCH: {
        let { selectors, listener } = action.payload
        return mapSelectors(selectors, selector => {
          return subscribers.remove({ selector, listener })
        })
      }
      default: {
        const prevState = store.getState()
        const result = nextDispatch(action)
        const nextState = store.getState()

        const list = subscribers.get()
        for (let i = 0; i < list.length; i++) {
          const { selector, listener } = list[i]
          const prev = selector(prevState)
          const next = selector(nextState)
          if (prev !== next) {
            listener(next, nextState)
          }
        }

        return result
      }
    }
  }
}

// export default function observer(store) {
//     return createObserver()(store);
// }
