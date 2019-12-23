const curry = require('lodash/curry')
const { join } = require('path')
const projectSrc = join(process.cwd(), 'src')

module.exports = curry((env, allLoaders) => [
  ...allLoaders,
  {
    id: 'typescript',
    test: /\.tsx?$/,
    loader: require.resolve('babel-loader'),
    include: [projectSrc],
    options: require('../babel.config')
  },
  {
    id: 'js-source-maps',
    test: /\.js$/,
    use: [require.resolve('source-map-loader')],
    enforce: 'pre'
  }
])
