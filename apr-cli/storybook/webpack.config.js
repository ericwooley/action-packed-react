const loaders = require('../webpack/loaders')('development')
const path = require('path')
module.exports = ({ config }) => {
  config.module.rules.push(...loaders)
  config.resolve.extensions.push('.ts', '.tsx')
  console.log('cwd', path.resolve(process.cwd(), 'src'))
  config.resolve.alias.src = path.join(process.cwd(), 'src')
  return config
}
