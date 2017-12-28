import { identity, get } from 'lodash'
import { createStore, applyMiddleware, bindActionCreators } from 'redux'
import { createEagle, watch, unwatch } from '../'
import { addTodo, play } from './helpers/actionCreators'
import * as reducers from './helpers/reducers'

describe('Index', () => {
  describe('createEagle', () => {
    it('returns a function', () => {
      expect(createEagle()).toBeInstanceOf(Function)
    })

    it('calls the listener when state changes', () => {
      const eagle = createEagle()
      const store = createStore(reducers.todos, applyMiddleware(eagle))

      const listener = jest.fn()
      store.dispatch(watch(identity, listener))
      store.dispatch(addTodo('foo'))
      expect(listener.mock.calls.length).toBe(1)
    })

    it('discards multiple identical state listeners', () => {
      const eagle = createEagle()
      const store = createStore(reducers.player, applyMiddleware(eagle))

      const selectPaused = state => state.ui.video.paused
      const listener = jest.fn()
      store.dispatch(watch(selectPaused, listener))
      store.dispatch(watch(selectPaused, listener))
      store.dispatch(watch(selectPaused, listener))
      store.dispatch(play())
      expect(listener.mock.calls.length).toBe(1)
    })

    it('unwatch removes the listener', () => {
      const eagle = createEagle()
      const store = createStore(reducers.todos, applyMiddleware(eagle))

      const listener = jest.fn()
      store.dispatch(watch(identity, listener))
      store.dispatch(unwatch(identity, listener))
      store.dispatch(addTodo('foo'))
      expect(listener.mock.calls.length).toBe(0)
    })

    it('transforms the selector and fires on changes', () => {
      const objectpath = path => state => get(state, path)
      const eagle = createEagle(objectpath)
      const store = createStore(reducers.player, applyMiddleware(eagle))
      const actions = bindActionCreators({ watch, play }, store.dispatch)

      const listener = jest.fn()
      actions.watch('ui.video.paused', listener)
      actions.play()
      expect(listener.mock.calls.length).toBe(1)
    })

    it('unwatch removes the transformed selector', () => {
      const objectpath = path => state => get(state, path)
      const eagle = createEagle(objectpath)
      const store = createStore(reducers.player, applyMiddleware(eagle))
      const actions = bindActionCreators(
        { watch, unwatch, play },
        store.dispatch
      )

      const listener = jest.fn()
      actions.watch('ui.video.paused', listener)
      actions.unwatch('ui.video.paused', listener)
      actions.play()
      expect(listener.mock.calls.length).toBe(0)
    })
  })
})
