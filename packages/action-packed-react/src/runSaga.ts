import { take, race, select, call } from 'redux-saga/effects'
import { IRouteOptions } from './types'
import { getVariablesForRoute, routeMatchesPath } from './routeMatcher'
import { updateHistory, selectors } from './routeReducer'

export function* createSagaForPack(pack: IRouteOptions<any, any>): any {
  function* waitForRelevantRouteChange(): any {
    let currentRoute = yield select(selectors.currentPath)
    let lastParams = getVariablesForRoute(route, currentRoute)
    while (true) {
      yield take([updateHistory._type])
      if (!routeMatches(yield select(selectors.activePath))) return true
      currentRoute = yield select(selectors.currentPath)
      const paramsForRoute = getVariablesForRoute(route, currentRoute)
      const paramsChanged = Object.keys(paramsForRoute).find(
        k => lastParams[k] !== paramsForRoute[k]
      )
      if (paramsChanged) return true
    }
  }
  const route = pack.routeComposer.route
  const routeMatches = (path: string) => routeMatchesPath(path, route)
  // While the route matches, let the race happen.
  while (yield call(routeMatches, yield select(selectors.currentPath))) {
    const {routeChangeCausedCancel} = yield race({
      routeChangeCausedCancel: call(waitForRelevantRouteChange),
      routeSaga: call(pack.saga)
    })
    // if the user let the saga die, wait for a route change before starting the saga again.
    if(!routeChangeCausedCancel) yield call(waitForRelevantRouteChange)
  }
}
