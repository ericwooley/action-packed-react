const R = require('remeda')
const typescript = require('./typescript')

module.exports = env => {
  const loaders = [typescript].map(loader => loader(env))
  return R.pipe(...loaders)([]).map(({ id, ...loader }) => loader)
}
