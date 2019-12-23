const curry = require('lodash/curry')

module.exports = curry((env, allLoaders) => [
  ...allLoaders,
  {
    id: 'css',
    test: /\.css$/i,
    use: ['style-loader', 'css-loader']
  }
])
