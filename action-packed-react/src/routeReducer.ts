import { createReducerFromActionPack, createActionPack } from './createReducer'
import { IRouteState, IRouteStatus } from './types'
import { createSelector } from 'reselect'
import { BareBonesState } from '.'
import { routeMatchesPath, getVariablesForRoute } from './routeMatcher'
export const initialState: IRouteState = {
  history: [],
  currentLocation: {
    pathname: '/',
    search: '',
    hash: '',
    action: 'PUSH'
  },
  userRoutes: [],
  activeRoute: '/'
}

export const updateHistory = createActionPack<IRouteState, IRouteStatus>(
  '@APR/updateLocation',
  (state, action) => ({
    ...state,
    history: [...state.history, state.currentLocation],
    currentLocation: action.payload
  })
)
export const addUserRoute = createActionPack<IRouteState, string>(
  '@APR/ADD_USER_ROUTE',
  (state, action) => ({
    ...state,
    userRoutes: Array.from(new Set([...state.userRoutes, action.payload]))
  })
)
export const activateRoute = createActionPack<IRouteState, string>(
  '@APR/ACTIVATE_ROUTE',
  (state, action) => ({
    ...state,
    activeRoute: action.payload
  })
)
export const routeCleared = createActionPack<IRouteState, string>(
  '@APR/ROUTE_CLEARED',
  state => state
)

export const routeReducer = createReducerFromActionPack(initialState, {
  updateHistory,
  addUserRoute,
  activateRoute,
  routeCleared
})

// selectors
const base = (s: BareBonesState) => s._route
const currentPath = createSelector(base, r => r.currentLocation.pathname)
const activePath = createSelector(base, r => r.activeRoute)
const routes = createSelector(base, r => r.userRoutes)
const routeMatchFilter = (p: string, r: string[]) =>
  r
    .filter(routeMatchesPath(p))
    .sort()
    .reverse()



const activePathMatchingRoutes = createSelector(
  activePath,
  routes,
  routeMatchFilter
)

const params = createSelector(
  activePathMatchingRoutes,
  activePath,
  (matchingRoutes, route) =>
  matchingRoutes.reduce(
      (acc, path) => ({ ...acc, ...getVariablesForRoute(path, route) }),
      {}
    )
)

const nextPathMatchingRoutes = createSelector(
  currentPath,
  routes,
  routeMatchFilter
)
const toTruthMap = (rts: string[]) =>
  rts.reduce(
    (map, r) => {
      map[r] = true
      return map
    },
    {} as { [k: string]: boolean }
  )
const activePathMatchingRouteMap = createSelector(
  activePathMatchingRoutes,
  toTruthMap
)

const nextPathMatchingRouteMap = createSelector(
  nextPathMatchingRoutes,
  toTruthMap
)
export const selectors = {
  base,
  activePath,
  currentPath,
  routes,
  nextPathMatchingRoutes,
  activePathMatchingRoutes,
  activePathMatchingRouteMap,
  nextPathMatchingRouteMap,
  params
}
