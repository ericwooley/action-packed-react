---
to: .storybook/webpack.config.js
---
const loaders = require('apr-cli/webpack/loaders')('development')
const path = require('path')
const aliasModules = require('apr-cli/webpack/alias')('development')
const srcPath = require('apr-cli/webpack/utils/srcPath')
module.exports = ({ config }) => {
  config.module.rules.push(...loaders)
  config.resolve.extensions.push('.ts', '.tsx')
  console.log('cwd', path.resolve(process.cwd(), 'src'))
  config.resolve.alias = { ...aliasModules(config.resolve.alias), 'app/index.ts': srcPath('./app.story.tsx') }
  return config
}
