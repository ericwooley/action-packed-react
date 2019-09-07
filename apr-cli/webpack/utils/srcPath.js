const path = require('path')
module.exports = function srcPath (subdir) {
  const result = path.join(process.cwd(), 'src', subdir)
  return result
}
