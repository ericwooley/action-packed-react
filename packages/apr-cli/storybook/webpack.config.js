let loaders = require('../dist/webpack/loaders')
loaders = loaders.default('storybook')
const path = require('path')
let aliasModules = require('../dist/webpack/alias')
aliasModules = aliasModules.default
const srcPath = require('../dist/webpack/utils/srcPath')
module.exports = ({ config }) => {
  console.log('before', config.module.rules)
  config.module.rules.push(...loaders)
  console.log('after', config.module.rules)
  config.resolve.extensions.push('.ts', '.tsx', '.css')
  console.log('cwd', path.resolve(process.cwd(), 'src'))
  config.resolve.alias = {
    ...aliasModules('development', config.resolve.alias),
    'app/index.ts': srcPath('./app.story.tsx')
  }
  return config
}
