var HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const debug = require('debug')
const log = debug('apr:webpack')
const loaders = require('./loaders')
const aliasModules = require('./alias')

const entry = path.join(process.cwd(), './src/index.tsx')
const mode = 'development'
const alias = aliasModules(mode, {})
const rules = loaders(mode)

log('entry', entry)
log('alias', alias)

module.exports = {
  entry,
  mode,
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
    rules
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
