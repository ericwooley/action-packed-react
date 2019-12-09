const curry = require('lodash/curry')
const { join } = require('path')
const projectSrc = join(process.cwd(), 'src')

module.exports = curry((env, allLoaders) => [
  ...allLoaders,
  {
    id: 'typescript',
    test: /\.tsx?$/,
    loader: 'babel-loader',
    include: [projectSrc],
    options: require('./babel.config')
  },
  {
    id: 'js-source-maps',
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre'
  }
])
