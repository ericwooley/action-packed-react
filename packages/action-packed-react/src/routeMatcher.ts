import { IRouteProps } from './link'
import { curry } from 'lodash'

/**
 * Get the routes which match the path.
 * @param routeMap Dictionary of route definitions
 * @param routeState routeState which contains the current path
 * @returns {string[]} array of paths which math the current route
 */
export function routeMatcher(routeMap: { [key: string]: any }, routeState: { pathname: string }) {
  const path = routeState.pathname
  const routes = Object.keys(routeMap)
  return routes.filter(routeMatchesPath(path))
}

const routeMatchesPathWithOptions = curry(
  ({ exact }: { exact: boolean }, path: string, route: string) => {
    const segments = path
      .toLowerCase()
      .split('/')
      .filter(s => !!s)
    const routeSegments = route
      .toLowerCase()
      .split('/')
      .filter(r => !!r)
    if (segments.length < routeSegments.length) return false
    if (exact && segments.length !== routeSegments.length) {
      return false
    }
    const misMatch = segments.find((segment, i) => {
      const route = routeSegments[i]
      if (!route) return false
      if (route.indexOf(':') === 0) return false
      return route !== segment
    })

    return !misMatch
  }
)
/**
 * Curried function which takes a path and a route, then matches the route
 * to the path.
 *
 * use `/:param/` for url params
 */
export const routeMatchesPath = routeMatchesPathWithOptions({ exact: false })
/**
 * Curried function which takes a path and a route, then matches the route
 * to the path.
 *
 * use `/:param/` for url params
 *
 * Will fail if segments are different length
 */
export const routeMatchesPathExactly = routeMatchesPathWithOptions({ exact: true })
const segmentIsVariable = (segment: string) => segment.indexOf(':') === 0
const varNameFromSegment = (segment: string) => segment.slice(1)
/**
 * Extracts route variables specified in path definition.
 * @param path {string} path to check for variables
 * @param route {string} route to extract variables from
 */
export const getVariablesForRoute = (path: string, route: string) => {
  const segments = path.split('/').filter(s => !!s)
  const routeSegments = route.split('/').filter(r => !!r)
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

/**
 * Takes a path, and creates a path manipulation object.
 * @param path {string}
 */
export const createRouteComposer = <T extends IRouteLimitations = {}>(
  path: string
): IRouteComposer<T> => {
  const segments = path.split('/')
  return {
    route: path,
    /**
     * converts an object into paths, based on the path variables, and object keys.
     */
    createUrl: (args: T) =>
      `/${segments
        .filter(s => s)
        .map((s: string) => {
          if (segmentIsVariable(s)) {
            return args[varNameFromSegment(s)]
          }
          return s
        })
        .join('/')}`
  }
}

export const combineRoutes = <
  ChildRouteProps extends IRouteLimitations,
  ParentRouteProps extends IRouteLimitations
>(
  parentRoute: IRouteComposer<ParentRouteProps>,
  childRoute: IRouteComposer<ChildRouteProps>
) => {
  const combinedRoute = [parentRoute.route, childRoute.route].join('/')
  type IFullRouteProps = ChildRouteProps & ParentRouteProps
  return createRouteComposer<IFullRouteProps>(combinedRoute)
}
