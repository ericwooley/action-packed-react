const changeCase = require('change-case')

module.exports = (name) => ({
  type: 'input',
  name: 'name',
  message: 'Name your ' + name,
  validate: (result) => {
    if (changeCase.camel(result) !== result) {
      return 'name must be camel case'
    }
    console.log('name is fine', changeCase.camel(result), result)
    return true
  },
  format: changeCase.camel,
  result: changeCase.camel
})
