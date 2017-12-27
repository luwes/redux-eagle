import { identity } from 'lodash'
import { createStore, applyMiddleware } from 'redux'
import { createObserver, watch, unwatch } from '../'
import { addTodo, play } from './helpers/actionCreators'
import * as reducers from './helpers/reducers'

describe('Index', () => {
  describe('createObserver', () => {
    it('returns a function', () => {
      expect(createObserver()).toBeInstanceOf(Function)
    })

    it('calls the listener when state changes', () => {
      const observer = createObserver()
      const store = createStore(reducers.todos, applyMiddleware(observer))

      const listener = jest.fn()
      watch(store, identity, listener)
      store.dispatch(addTodo('foo'))
      expect(listener.mock.calls.length).toBe(1)
    })

    it('discards multiple identical state listeners', () => {
      const observer = createObserver()
      const store = createStore(reducers.player, applyMiddleware(observer))

      const selectPaused = (state) => state.ui.video.paused
      const listener = jest.fn()
      watch(store, selectPaused, listener)
      watch(store, selectPaused, listener)
      watch(store, selectPaused, listener)
      store.dispatch(play())
      expect(listener.mock.calls.length).toBe(1)
    })

    it('unwatch removes the listener', () => {
      const observer = createObserver()
      const store = createStore(reducers.todos, applyMiddleware(observer))

      const listener = jest.fn()
      watch(store, identity, listener)
      unwatch(store, identity, listener)
      store.dispatch(addTodo('foo'))
      expect(listener.mock.calls.length).toBe(0)
    })

  })
})
