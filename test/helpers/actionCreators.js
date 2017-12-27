import { ADD_TODO, PLAY } from './actionTypes'

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function play() {
  return { type: PLAY }
}
