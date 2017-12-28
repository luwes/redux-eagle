/**
 * Default compare function
 * @param  {*} a
 * @param  {*} b
 * @return {boolean}
 */
export function defaultCompare(a, b) {
  return a === b
}

/**
 * Default selector transform function. This can be useful to convert string
 * based selectors into selector functions.
 * @param  {*} selector
 * @return {Function}
 */
export function defaultTransform(selector) {
  return selector
}

/**
 * Creates a function that performs a partial deep comparison between a given
 * object and `source`, returning `true` if the given object has equivalent
 * property values, else `false`.
 * @param  {Object} obj
 * @param {Object} src
 * @return {boolean}
 */
export const matches = obj => src => {
  return Object.keys(obj).every(k => obj[k] === src[k])
}

/**
 * A helper function to create a collection that can query objects based on
 * property matches and adds support to easily get or insert such objects.
 * @param  {Array}  list list with objects
 * @return {Object} the collection API
 */
export const createCollection = (list = []) => ({
  get(key) {
    return key ? find(list, matches(key)) : list
  },
  insert(key) {
    return (list = list.concat(key)).slice(-1).pop()
  },
  getOrInsert(key) {
    return this.get(key) || this.insert(key)
  },
  remove(key) {
    return list.splice(findIndex(list, matches(key)), 1).pop()
  }
})

function findIndex(list, predicate) {
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      return i
    }
  }
}

function find(list, predicate) {
  return list[findIndex(list, predicate)]
}
