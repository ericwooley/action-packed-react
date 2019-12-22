const loaders = require('../webpack/loaders')('development')
const path = require('path')
const aliasModules = require('../webpack/alias')('development')
const srcPath = require('../webpack/utils/srcPath')
module.exports = ({ config }) => {
  config.module.rules.push(...loaders)
  config.resolve.extensions.push('.ts', '.tsx')
  console.log('cwd', path.resolve(process.cwd(), 'src'))
  config.resolve.alias = { ...aliasModules(config.resolve.alias), 'app/index.ts': srcPath('./app.story.tsx') }
  return config
}
