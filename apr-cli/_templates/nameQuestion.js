const changeCase = require('change-case')

module.exports = (name) => ({
  type: 'input',
  name: 'name',
  message: 'Name your ' + name,
  validate: (result) => {
    if (changeCase.camel(result) !== result) {
      return 'name must be camel case '
    }
    return true
  },
  // scrapped for now.
  // format: changeCase.camel,
  result: changeCase.camel
})
