module.exports = (env, allLoaders) => [
  {
    id: 'css',
    priority: 200,
    test: /\.css$/i,
    use: ['style-loader', 'css-loader']
  }
]
