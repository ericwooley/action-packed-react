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
    options: {
      presets: ['@babel/react', '@babel/typescript', ['@babel/env', { modules: false }]],
      plugins: []
    }
  },
  {
    id: 'js-source-maps',
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre'
  }
])
