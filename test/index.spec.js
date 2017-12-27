import { createObserver } from '../'

describe('Index', () => {
  describe('createObserver', () => {
    it('returns a function', () => {
      expect(createObserver()).toBeInstanceOf(Function)
    })
  })
})
