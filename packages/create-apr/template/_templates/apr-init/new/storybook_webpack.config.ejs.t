---
to: .storybook/webpack.config.js
---
let loaders = require('apr-cli/dist/webpack/loaders')
loaders = loaders.default('storybook')
const path = require('path')
let aliasModules = require('apr-cli/dist/webpack/alias')
aliasModules = aliasModules.default
const srcPath = require('apr-cli/dist/webpack/utils/srcPath')
module.exports = ({ config }) => {
  config.module.rules.push(...loaders)
  config.resolve.extensions.push('.ts', '.tsx', '.css')
  config.resolve.alias = {
    ...aliasModules('development', config.resolve.alias),
    'app/index.ts': srcPath('./app.story.tsx')
  }
  return config
}
