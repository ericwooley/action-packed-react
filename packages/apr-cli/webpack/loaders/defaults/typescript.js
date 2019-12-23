const { join } = require('path')
const projectSrc = join(process.cwd(), 'src')

module.exports = (env) => [
  {
    id: 'typescript',
    priority: 100,
    test: /\.tsx?$/,
    loader: require.resolve('babel-loader'),
    include: [projectSrc],
    options: require('../babel.config')
  },
  {
    id: 'js-source-maps',
    priority: 110,
    test: /\.js$/,
    use: [require.resolve('source-map-loader')],
    enforce: 'pre'
  }
]
