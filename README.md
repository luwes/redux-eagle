# 🦅 Redux Eagle

[![Build Status](https://travis-ci.org/luwes/redux-eagle.svg?branch=master)](https://travis-ci.org/luwes/redux-eagle)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Redux middleware to watch state changes.

## Install

```
npm i --save redux-eagle
```

## API

`createEagle()`

Creates the middleware function.

`watch(selectors, listener, [compare])`  
`unwatch(selectors, [listener])`

**selectors**  
A function or an array of functions that select a slice of state.

**listener**  
Must be a function. The listener gets called when the selected state changes.

**compare**  
A function that compares the old and new selected state.  
*Default: `===`*


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
