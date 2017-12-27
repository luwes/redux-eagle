// todo: replace find and findIndex

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
    return key ? list.find(matches(key)) : list
  },
  insert(key) {
    return (list = list.concat(key)).slice(-1).pop()
  },
  getOrInsert(key) {
    return this.get(key) || this.insert(key)
  },
  remove(key) {
    return list.splice(list.findIndex(matches(key)), 1).pop()
  }
})
