import React from 'react'
import { createStore, combineReducers, Reducer, Store, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { Task, runSaga } from 'redux-saga'
import { mount } from './RouteMounter'
import {
  routeReducer,
  updateHistory,
  initialState as routeInitialState,
  selectors,
  addUserRoute,
  activateRoute,
  routeCleared
} from './routeReducer'
import { connect } from 'react-redux'
import {
  ReducerToState,
  IOptions,
  IRoutesMap,
  ReducerObj,
  ICreateRouteOptions,
  IRoutesMapValue,
  IRouteOptions
} from './types'
import { take, call, all, select, spawn, fork, cancel, SimpleEffect, ForkEffectDescriptor } from 'redux-saga/effects'
import { createLink } from './link'
import { IRouteComposer, createRouteComposer, IRouteLimitations } from './routeMatcher'
import { ReactNode } from 'react'
import { createSagaForPack } from './runSaga';

function* emptySaga(): IterableIterator<any> {
  return null
}
const EmptyComponent = React.createElement('div')
const reducerBase = { _route: routeReducer }
export type BareBonesState = ReducerToState<typeof reducerBase>
export function createApp<R extends { [key: string]: Reducer }>({
  initialState,
  initialReducers,
  history,
  useHashHistory = true,
  render,
  importBaseComponent,
  RouteNotFoundComponent,
  LoadingComponent,
  composeEnhancers = compose
}: IOptions<R>) {
  type IInitialState = BareBonesState & ReducerToState<R>
  let currentReducerObject: typeof reducerBase & R = Object.assign({}, reducerBase, initialReducers)
  const combinedInitialState = Object.assign({}, initialState, {
    _route: routeInitialState
  })
  const routeMap: IRoutesMap = {}
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers(currentReducerObject),
    combinedInitialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  )
  sagaMiddleware.run(function* rootSaga(): any {
    let routeMountFork
    while (true) {
      yield take([updateHistory._type, addUserRoute._type])
      if (routeMountFork) yield cancel(routeMountFork)
      routeMountFork = yield fork(function*(): any {
        const currentPath = yield select(selectors.currentPath)

        const outdatedPath = yield select(selectors.activePath)
        if (currentPath !== outdatedPath) {
          const matchingRouteMap: ReturnType<
            typeof selectors.nextPathMatchingRouteMap
          > = yield select(selectors.nextPathMatchingRouteMap)
          const matchingRoutes: ReturnType<typeof selectors.nextPathMatchingRoutes> = yield select(
            selectors.nextPathMatchingRoutes
          )

          const oldMatchingRouteMap: ReturnType<
            typeof selectors.activePathMatchingRouteMap
          > = yield select(selectors.activePathMatchingRouteMap)
          const oldMatchingRoutes: ReturnType<
            typeof selectors.activePathMatchingRoutes
          > = yield select(selectors.activePathMatchingRoutes)
          const noLongerMatchingRoutes = oldMatchingRoutes.filter(r => !matchingRouteMap[r])
          const newlyMatchingRoutes = matchingRoutes.filter(r => !oldMatchingRouteMap[r])
          console.log('-------> routes', {
            matchingRoutes,
            oldMatchingRoutes,
            newlyMatchingRoutes,
            noLongerMatchingRoutes,
            allRoutes: yield select(selectors.routes),
          })
          const bundles: {
            pack: IRouteOptions<any, any>
            packLoader: IRoutesMapValue
          }[] = yield all(
            newlyMatchingRoutes
              .filter(route => routeMap[route])
              .map(route => routeMap[route])
              .map(packLoader => async () => {
                packLoader.onRouteMatch()
                const pack = await packLoader.loader()
                return { pack, packLoader }
              })
              .map(call)
          )
          yield all(
            bundles.map(({ pack }) => spawn(createSagaForPack, pack))
          )
          // no more yield here, react can't have another chance to interact with state
          const reducers = [currentReducerObject, ...bundles.map(c => c.pack.reducer)]
          // console.log('----> adding reducer for', newlyMatchingRoutes)
          currentReducerObject = Object.assign({}, ...reducers)
          store.replaceReducer(combineReducers(currentReducerObject))
          store.dispatch(activateRoute(currentPath))
          yield all(
            noLongerMatchingRoutes
              .map(route => async () => {
                const packLoader = routeMap[route]
                if (!packLoader) return
                const pack = await packLoader.loader()
                if (pack.reducer) {
                  // console.log('--> removing reducer for', route)
                  currentReducerObject = Object.keys(pack.reducer).reduce(
                    (reducer, key) => {
                      reducer[key] = () => null
                      return reducer
                    },
                    { ...(currentReducerObject as any) }
                  )
                  const reducer = combineReducers(currentReducerObject)
                  store.replaceReducer(reducer)
                  store.dispatch(routeCleared(route))
                  if (pack.onStateCleared) pack.onStateCleared()
                }
              })
              .map(call)
          )
          console.log('<----------- path switch complete')
        }
      })
    }
  })
  const createSubRoute = <
    IParentReducers extends ReducerObj,
    ParentRouteProps extends IRouteLimitations = {}
  >(
    parentRoute: IRouteComposer<ParentRouteProps>
  ) => <
    ISubReducers extends ReducerObj,
    RouteProps extends Partial<ParentRouteProps>,
    IComponentProps extends Partial<{
      params: RouteProps
      children: ReactNode
    }>
  >(
    route: IRouteComposer<RouteProps> | string,
    {
      reducer
    }: {
      reducer?: () => Promise<ISubReducers>
    },
    options: ICreateRouteOptions = {}
  ) => {
    type IRouteComponent = React.ComponentType<IComponentProps>
    type ILoadRouteComponent = () => Promise<IRouteComponent>
    type ILoadSaga = () => Promise<typeof emptySaga>
    let component: ILoadRouteComponent = (() =>
      EmptyComponent
    ) as any
    let saga: ILoadSaga = () => Promise.resolve(emptySaga)
    const { onRouteMatch = () => null } = options
    if (typeof route === 'string') route = createRouteComposer<{}>(route)
    const combinedRoute = [parentRoute.route, route.route].join('/')
    type IFullRouteProps = RouteProps & ParentRouteProps
    const routeComposer = createRouteComposer<IFullRouteProps>(combinedRoute)

    const setComponent = (componentLoader: ILoadRouteComponent) => {
      component = componentLoader
    }
    const setSaga = (sagaLoader: ILoadSaga) => {
      saga = sagaLoader
    }

    type ICompleteState = ReducerToState<ISubReducers & IParentReducers>
    const subRoute = {
      Link: createLink(history, routeComposer, useHashHistory),
      routeComposer,
      fullRoute: combinedRoute,
      routeSegment: route,
      setComponent,
      setSaga,
      register: () => {
        routeMap[combinedRoute] = {
          onRouteMatch,
          route: routeComposer,
          parent: routeMap[parentRoute.route],
          loader: async () => {
            const [loadedReducer, loadedComponent, loadedSaga] = await Promise.all([
              reducer ? reducer() : Promise.resolve({}),
              component(),
              saga()
            ])
            return {
              routeComposer: routeComposer,
              component: loadedComponent,
              reducer: loadedReducer,
              saga: loadedSaga
            }
          }
        }
        store.dispatch(addUserRoute(combinedRoute))
      },
      getState: () => (store.getState() as any) as ICompleteState,
      baseSelector: (s: ICompleteState) => s,
      paramSelector: (selectors.params as any) as (s: ICompleteState) => RouteProps,
      connect: <T, OwnProps, H>(
        mapStateToProps: (state: ICompleteState, ownProps: OwnProps) => T,
        handlers?: H
      ) =>
        connect(
          mapStateToProps,
          handlers
        ),
      createSubRoute: createSubRoute<ISubReducers & IParentReducers, IFullRouteProps>(routeComposer)
    }
    return subRoute
  }

  const unlisten = history.listen((location, action) => {
    store.dispatch(
      updateHistory({
        pathname: location.pathname,
        hash: location.hash,
        search: location.search,
        action,
        state: location.state,
        key: location.key
      })
    )
  })
  return {
    shutDown: () => {
      unlisten()
    },
    init: async () => {
      const component = await importBaseComponent
      return new Promise(r => {
        mount(
          {
            pathname: '',
            activeRoute: '',
            routeMap,
            matchingRoutes: [],
            component,
            RouteNotFoundComponent,
            LoadingComponent,
            onMount: r
          },
          store,
          render
        )
        store.dispatch(
          updateHistory({
            pathname: history.location.pathname,
            hash: history.location.hash,
            search: history.location.search,
            action: 'REPLACE',
            state: history.location.state,
            key: history.location.key
          })
        )
      })
    },
    createSubRoute: createSubRoute<IInitialState>(createRouteComposer('')),
    store: store as Store<IInitialState>,
    baseSelector: (s: IInitialState) => s
  }
}
