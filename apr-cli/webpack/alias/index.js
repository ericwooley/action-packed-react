const curry = require('lodash/curry')
const srcPath = require('../utils/srcPath')
module.exports = curry((env, alias) => ({ ...alias, app: srcPath(''), src: srcPath('') }))
