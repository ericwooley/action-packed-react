import { asMountableComponent } from './asMountableComponent'
import { navigateOnMount } from './navigateOnMount'
import { ReactChildren, createElement } from 'react'
import { createStore, combineReducers, Reducer, Store, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
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
import { take, call, all, select, spawn, fork, cancel } from 'redux-saga/effects'
import { createLink } from './link'
import { IRouteComposer, createRouteComposer, IRouteLimitations } from './routeMatcher'
import { createSagaForPack } from './runSaga'

function* emptySaga(): IterableIterator<any> {
  return null
}
const PassThroughComponent = (props: { children: any }) => props.children
const EmptyComponent = createElement('div')
const reducerBase = { _route: routeReducer }
type EmptyKeys = keyof {}
export type BareBonesState = ReducerToState<typeof reducerBase>
export function createApp<R extends { [key: string]: Reducer }>({
  initialState,
  initialReducers,
  history,
  useHashHistory = true,
  layout,
  RouteNotFoundComponent,
  LoadingComponent,
  saga,
  composeEnhancers = compose,
  baseRoute = '/'
}: IOptions<R>) {
  type IInitialState = BareBonesState & ReducerToState<R>
  let currentReducerObject: typeof reducerBase & R = Object.assign({}, reducerBase, initialReducers)
  const combinedInitialState = Object.assign({}, initialState, {
    _route: routeInitialState
  })
  const appRoute = createRouteComposer(baseRoute)
  const routeMap: IRoutesMap = {
    [baseRoute]: {
      onRouteMatch: () => null,
      route: appRoute,
      initialState: initialState,
      loader: async () => {
        return {
          initialState: initialState,
          routeComposer: appRoute,
          component: PassThroughComponent,
          reducer: initialReducers,
          saga: saga || (emptySaga as any)
        }
      }
    }
  }
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers(currentReducerObject),
    combinedInitialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  )
  store.dispatch(addUserRoute(baseRoute))
  async function init() {
    let component: React.ComponentType<any> = await Promise.resolve(layout as any)
    component = (component as any).default || component
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
    return mount(
      {
        pathname: '',
        activeRoute: '',
        routeMap,
        matchingRoutes: [],
        component,
        RouteNotFoundComponent,
        LoadingComponent
      },
      store
    )
  }
  const AppComponent = asMountableComponent(LoadingComponent, init)
  sagaMiddleware.run(function* sagaRouteManager(): any {
    if (saga) {
      try {
        // fork to yield the saga resolver, so loading it doesn't block
        yield fork(function*() {
          const resolvedSaga = yield call(() => Promise.resolve(saga))
          yield fork(resolvedSaga.default || resolvedSaga)
        })
      } catch (e) {
        console.error('Error running user root saga: ', e)
      }
    }
    let routeMountFork
    while (true) {
      yield take([updateHistory._type, addUserRoute._type])
      if (routeMountFork) {
        yield cancel(routeMountFork)
      }
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
          // console.log('-------> routes', {
          //   currentPath,
          //   matchingRoutes,
          //   oldMatchingRoutes,
          //   newlyMatchingRoutes,
          //   noLongerMatchingRoutes,
          //   allRoutes: yield select(selectors.routes)
          // })
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
          yield all(bundles.map(({ pack }) => spawn(createSagaForPack, pack)))
          const newReducers = bundles.map(c => c.pack.reducer)
          // no more yield here, react can't have another chance to interact with state
          const reducers = [currentReducerObject, ...newReducers]
          // console.log('----> adding reducer for', newlyMatchingRoutes)
          currentReducerObject = Object.assign({}, ...reducers)
          store.replaceReducer(combineReducers(currentReducerObject))
          store.dispatch(activateRoute(currentPath))
          bundles
            .filter(r => r.pack.initialState)
            .forEach(r => {
              Object.keys(r.pack.reducer)
                .map(k => ({
                  reducer: r.pack.reducer[k],
                  initialState: r.pack.initialState && r.pack.initialState[k]
                }))
                .filter(r => r.reducer && r.initialState)
                .forEach(({ reducer, initialState }) => {
                  store.dispatch(reducer.actionCreators.replaceState(initialState))
                })
            })
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
          // console.log('<----------- path switch complete')
        }
      })
    }
  })
  const createSubRoute = <
    IParentReducers extends ReducerObj,
    ParentRouteProps extends IRouteLimitations = {}
  >(
    parentRoute: IRouteComposer<ParentRouteProps>
  ) => {
    return <
      ISubReducers extends ReducerObj,
      RouteProps extends ParentRouteProps,
      IComponentProps extends Partial<{
        params: RouteProps
        children: ReactChildren
      }>
    >(
      route: IRouteComposer<RouteProps> | string,
      reducer?: () => Promise<
        | {
            default: keyof ISubReducers extends keyof IParentReducers
              ? keyof ISubReducers extends EmptyKeys // This is allowed if it's empty
                ? ISubReducers
                : 'Reducer must not share any keys with parent route reducers'
              : ISubReducers
          }
        | (keyof ISubReducers extends keyof IParentReducers
            ? keyof ISubReducers extends EmptyKeys // This is allowed if it's empty
              ? ISubReducers
              : 'Reducer must not share any keys with parent route reducers'
            : ISubReducers)
      >,
      options: ICreateRouteOptions<ReducerToState<ISubReducers>> = {}
    ) => {
      type IRouteComponent = React.ComponentType<IComponentProps>
      type ILoadRouteComponent = () => Promise<{ default: IRouteComponent } | IRouteComponent>
      type ILoadSaga = () => Promise<typeof emptySaga>
      let component: ILoadRouteComponent = (() => EmptyComponent) as any
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
        navigateOnMount: (routeProps: IFullRouteProps, renderFullApp = false) =>
          navigateOnMount(AppComponent, { history, routeComposer, routeProps, renderFullApp }),
        Link: createLink(history, routeComposer, useHashHistory),
        parent: parentRoute,
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
            initialState: options.initialState,
            loader: async () => {
              const [loadedReducer, loadedComponent, loadedSaga] = await Promise.all([
                reducer
                  ? reducer().then((r: any) =>
                      r.default ? (r.default as ISubReducers) : (r as ISubReducers)
                    )
                  : Promise.resolve({}),
                component().then(c =>
                  (c as { default: IRouteComponent }).default
                    ? (c as { default: IRouteComponent }).default
                    : (c as IRouteComponent)
                ),
                saga()
              ])
              return {
                initialState: options.initialState,
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
        createSubRoute: createSubRoute<ISubReducers & IParentReducers, IFullRouteProps>(
          routeComposer
        )
      }
      return subRoute
    }
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
    AppComponent,
    routeComposer: appRoute,
    NavigateOnMount: navigateOnMount(AppComponent, {
      history,
      routeComposer: appRoute,
      routeProps: {},
      renderFullApp: true
    }),
    shutDown: () => {
      unlisten()
    },
    init,
    createSubRoute: createSubRoute<IInitialState>(createRouteComposer('')),
    store: store as Store<IInitialState>,
    baseSelector: (s: IInitialState) => s
  }
}
