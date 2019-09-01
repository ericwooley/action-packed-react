module.exports = env => allLoaders => [
  ...allLoaders,
  {
    id: 'typescript',
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: { reportFiles: ['src/**/*.{ts,tsx}'], allowTsInNodeModules: true }
  }
]
