import { ADD_TODO, PLAY, ENDED } from './actionTypes'

function id(state = []) {
  return (
    state.reduce((result, item) => (item.id > result ? item.id : result), 0) + 1
  )
}

export function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: id(state),
          text: action.text
        }
      ]
    default:
      return state
  }
}

export function player(state = {}, action) {
  return {
    ui: ui(state, action)
  }
}

function ui(state = {}, action) {
  return {
    video: video(state, action)
  }
}

const videoInitialState = {
  paused: true,
  playInitiated: false,
  ended: false
}

function video(state = videoInitialState, action) {
  switch (action.type) {
    case PLAY:
      return {
        ...state,
        paused: false,
        playInitiated: true,
        ended: false
      }
    case ENDED:
      return {
        ...state,
        paused: true,
        playInitiated: true,
        ended: true
      }
    default:
      return state
  }
}
