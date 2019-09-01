var HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const debug = require('debug')
const log = debug('apr:webpack')
const R = require('remeda')

const entry = path.join(process.cwd(), './src/index.tsx')
log('entry', entry)
function srcPath (subdir) {
  const result = path.join(process.cwd(), 'src', subdir)
  return result
}
const alias = {
  app: srcPath('')
}
log('alias', alias)

module.exports = {
  entry,
  mode: 'development',
  devServer: {
    historyApiFallback: {
      index: 'index.html'
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](?!(action-packed-react)\/)/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: R.pipe(require('./loaders/typescript.js')('development'))([]).map(
      ({ id, ...loader }) => loader
    )
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'html/index.html',
      filename: 'index.html'
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias
  },
  devtool: 'eval',
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.js'
  }
}
