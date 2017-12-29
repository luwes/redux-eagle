import { ADD_TODO, PLAY, ENDED } from './actionTypes'

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function play() {
  return { type: PLAY }
}

export function ended() {
  return { type: ENDED }
}
