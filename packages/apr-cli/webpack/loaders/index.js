const typescript = require('./defaults/typescript')
const css = require('./defaults/css')
const debug = require('debug')
const log = debug('apr:webpack')
module.exports = env => {
  const result = [typescript, css]
    .map(loader => loader(env))
    .flat()
    .sort((a, b) => {
      if (a.priority < b.priority) {
        return -1
      }
      if (a.priority > b.priority) {
        return 1
      }
      // a must be equal to b
      return 0
    })
    .map(({ id, priority, ...loader }) => loader)
    .reduce((allLoaders, newLoaders) => {
      return [...allLoaders, newLoaders]
    }, [])
  log('loaders: ', result)
  return result
}
