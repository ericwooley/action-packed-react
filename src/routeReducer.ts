import { createReducerFromActionPack, createActionPack } from './createReducer'
import { IRouteState, IRouteStatus } from './types'
import { createSelector } from 'reselect'
import { BareBonesState } from './action-packed-react'
import { routeMatchesPath } from './routeMatcher'
export const initialState: IRouteState = {
  history: [],
  currentLocation: {
    pathname: '',
    search: '',
    hash: '',
    action: 'PUSH'
  },
  userRoutes: []
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

export const routeReducer = createReducerFromActionPack(initialState, [
  updateHistory,
  addUserRoute
])

// selectors
const base = (s: BareBonesState) => s._route
const currentPath = createSelector(base, r => r.currentLocation.pathname)
const routes = createSelector(base, r => r.userRoutes)
const matchingRoutes = createSelector(currentPath, routes, (p, r) =>
  r
    .filter(routeMatchesPath(p))
    .sort()
    .reverse()
)
const matchingRouteMap = createSelector(matchingRoutes, rts =>
  rts.reduce(
    (map, r) => {
      map[r] = true
      return map
    },
    {} as { [k: string]: boolean }
  )
)
export const selectors = {
  base,
  currentPath,
  routes,
  matchingRoutes,
  matchingRouteMap
}
