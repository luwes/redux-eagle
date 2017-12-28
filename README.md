# 🦅 Redux Eagle

[![Build Status](https://travis-ci.org/luwes/redux-eagle.svg?branch=master)](https://travis-ci.org/luwes/redux-eagle)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Redux middleware to watch state changes using transformable selectors.

## Usage

```js
import { createStore, applyMiddleware } from 'redux'
import { createEagle, watch, unwatch } from 'redux-eagle'

const eagle = createEagle()
const store = createStore(reducer, applyMiddleware(eagle))

watch(store, (state) => state.desert.mice, catchMouse)

function catchMouse(livingMouse, deadMouse, state) {
  console.log(livingMouse)
}

store.dispatch(mouseEnterDesert())
```
