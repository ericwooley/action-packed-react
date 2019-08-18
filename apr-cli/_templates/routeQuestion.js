const { findRoutes, uglyRoute } = require('../dist/utils/routes')
const { join } = require('path')
const routes = findRoutes('route', { pretty: true })

module.exports = {
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
}
