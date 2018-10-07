export function routeMatcher(
  routeMap: { [key: string]: any },
  routeState: { pathname: string }
) {
  const path = routeState.pathname
  const routes = Object.keys(routeMap)
  return routes.filter(routeMatchesPath(path))
}

export const routeMatchesPath = (path: string) => (route: string) => {
  const segments = path
    .toLowerCase()
    .split('/')
    .filter(s => !!s)
  const routeSegments = route
    .toLowerCase()
    .split('/')
    .filter(r => !!r)
  if (segments.length !== routeSegments.length) return false
  const misMatch = segments.find((segment, i) => {
    const route = routeSegments[i]
    if (route.indexOf(':') === 0) return false
    return route !== segment
  })
  return !misMatch
}

export const getVariablesForRoute = (path: string, route: string) => {
  const segments = path.split('/').filter(s => !!s)
  const routeSegments = route.split('/').filter(r => !!r)
  if (segments.length !== routeSegments.length) {
    throw new Error('Route mismatch')
  }
  return segments.reduce(
    (vars, segment, index) => {
      if (segment.indexOf(':') === 0) {
        const varName = segment.slice(1)
        vars[varName] = routeSegments[index]
      }
      return vars
    },
    {} as {
      [key: string]: string
    }
  )
}
