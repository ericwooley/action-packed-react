module.exports.presets = [
  [require.resolve('@babel/preset-env'), { modules: false }],
  require.resolve('@babel/preset-react'),
  require.resolve('@babel/preset-typescript')
]
// module.exports.plugins = [require.resolve('@babel/plugin-transform-runtime')]
