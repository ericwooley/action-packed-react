import { IRouteProps } from './link'

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
  if (segments.length < routeSegments.length) return false

  const misMatch = segments.find((segment, i) => {
    const route = routeSegments[i]
    if (!route) return false
    if (route.indexOf(':') === 0) return false
    return route !== segment
  })
  return !misMatch
}

const segmentIsVariable = (segment: string) => segment.indexOf(':') === 0
const varNameFromSegment = (segment: string) => segment.slice(1)
export const getVariablesForRoute = (path: string, route: string) => {
  const segments = path.split('/').filter(s => !!s)
  const routeSegments = route.split('/').filter(r => !!r)
  if (segments.length < routeSegments.length) {
    throw new Error('Route mismatch')
  }
  return segments.reduce(
    (vars, segment, index) => {
      if (segmentIsVariable(segment)) {
        const varName = varNameFromSegment(segment)
        /* istanbul ignore next */
        vars[varName] = routeSegments[index] || ''
      }
      return vars
    },
    {} as {
      [key: string]: string
    }
  )
}

export interface IRouteComposer<T> {
  route: string
  createUrl: (args: T) => string
}

export type IRouteLimitations = Partial<React.HTMLProps<HTMLAnchorElement>> & {
  [key: string]: string
} & Partial<IRouteProps>

export const createRouteComposer = <T extends IRouteLimitations = {}>(
  route: string
): IRouteComposer<T> => {
  const segments = route.split('/')
  return {
    route,
    createUrl: (args: T) =>
      segments
        .map((s: string) => {
          if (segmentIsVariable(s)) {
            return args[varNameFromSegment(s)]
          }
          return s
        })
        .join('/')
  }
}
