const typescript = require('./defaults/typescript')
const css = require('./defaults/css')

module.exports = env => {
  return [typescript, css].map(loader => loader(env)).map(({ id, ...loader }) => loader)
}
