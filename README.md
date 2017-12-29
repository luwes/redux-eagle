# 🦅 Redux Eagle

[![Build Status](https://travis-ci.org/luwes/redux-eagle.svg?branch=master)](https://travis-ci.org/luwes/redux-eagle)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Redux middleware to watch state changes using transformable selectors.

## Install

```
npm i --save redux-eagle
```

## Example

##### basic example

```js
import { createStore, applyMiddleware } from 'redux'
import { createEagle, watch, unwatch } from 'redux-eagle'

const eagle = createEagle()
const store = createStore(reducer, applyMiddleware(eagle))

store.dispatch(watch((state) => state.desert.mice, catchMouse))

function catchMouse(livingMouse, deadMouse, state) {
  console.log(livingMouse)
}

store.dispatch(mouseEnterDesert())
```

##### example w/ transformed selector

```js
import { createStore, applyMiddleware, bindActionCreators } from 'redux'
import { createEagle, watch } from 'redux-eagle'

const objectpath = (path) => (state) => get(state, path)
const eagle = createEagle(objectpath)
const store = createStore(reducer, applyMiddleware(eagle))
const actions = bindActionCreators({ watch, mouseEnterDesert }, store.dispatch)

actions.watch('desert.mice', catchMouse)

function catchMouse(livingMouse, deadMouse, state) {
  console.log(livingMouse)
}

actions.mouseEnterDesert()
```

##### example w/ partially applied watch and transformed selector

```js
import { createStore, applyMiddleware, bindActionCreators } from 'redux'
import { createEagle, watch } from 'redux-eagle'

const objectpath = (path, specifier) => {
  return state => get(state, `${path}.${specifier}`)
}

const eagle = createEagle(objectpath)
const store = createStore(reducer, applyMiddleware(eagle))
const desertWatch = watch('desert')
const actions = bindActionCreators({ desertWatch, mouseEnterDesert }, store.dispatch)

actions.desertWatch('mice', catchMouse)

function catchMouse(livingMouse, deadMouse, state) {
  console.log(livingMouse)
}

actions.mouseEnterDesert()
```
