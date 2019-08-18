const { findRoutes, uglyRoute } = require('../../../dist/utils/routes')
const changeCase = require('change-case')
const { join } = require('path')
const routes = findRoutes('route', { pretty: true })
const promptArgs = require('../../promptArgsUtil')
// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
const questions = [
  {
    type: 'select',
    name: 'route',
    message: 'Select parent route',
    choices: [...routes],
    result: uglyRoute,
    validate: result => {
      const uglyRoutes = routes.map(uglyRoute)
      if (!uglyRoutes.find(r => join(process.cwd(), r) === join(process.cwd(), uglyRoute(result)))) {
        return `
      Invalid route ${result}
      valid routes: ${uglyRoutes.join(' | ')}`.trim()
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'name',
    message: 'Name your route',
    validate: (result) => {
      if (changeCase.camel(result) !== result) {
        return 'name must be camel case'
      }
      console.log('name is fine', changeCase.camel(result), result)
      return true
    },
    format: changeCase.camel,
    result: changeCase.camel
  }
]
module.exports = {
  prompt: promptArgs(questions)
}
