const curry = require('lodash/curry')
module.exports = curry((env, allLoaders) => [
  ...allLoaders,
  {
    id: 'typescript',
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: { reportFiles: ['src/**/*.{ts,tsx}'], allowTsInNodeModules: true }
  }
])
