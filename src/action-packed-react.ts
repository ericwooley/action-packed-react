import {
  createStore,
  combineReducers,
  Reducer,
  Store,
  applyMiddleware
} from 'redux'
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
  IRouteOptionsCreator,
  ICreateRouteOptions,
  IRoutesMapValue,
  IRouteOptions
} from './types'
import { take, select, all, call, put } from 'redux-saga/effects'
import { createLink } from './link'
import {
  IRouteComposer,
  createRouteComposer,
  IRouteLimitations
} from './routeMatcher'

const reducerBase = { _route: routeReducer }
export type BareBonesState = ReducerToState<typeof reducerBase>
export function createApp<R extends { [key: string]: Reducer }>({
  initialState,
  initialReducers,
  history,
  render,
  importBaseComponent
}: IOptions<R>) {
  type IInitialState = BareBonesState & ReducerToState<R>
  let currentReducerObject: typeof reducerBase & R = Object.assign(
    {},
    reducerBase,
    initialReducers
  )
  const combinedInitialState = Object.assign({}, initialState, {
    _route: routeInitialState
  })
  const routeMap: IRoutesMap = {}
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers(currentReducerObject),
    combinedInitialState,
    applyMiddleware(sagaMiddleware)
  )
  sagaMiddleware.run(function* rootSaga(): any {
    while (true) {
      yield take(updateHistory._type)
      const currentPath = yield select(selectors.currentPath)
      const allRoutes = yield select(selectors.routes)
      const outdatedPath = yield select(selectors.activePath)
      if (currentPath !== outdatedPath) {
        // console.log(
        //   'de-activating route',
        //   outdatedPath,
        //   ' to mount',
        //   currentPath
        // )
        const matchingRouteMap: ReturnType<
          typeof selectors.nextPathMatchingRouteMap
        > = yield select(selectors.nextPathMatchingRouteMap)
        const matchingRoutes: ReturnType<
          typeof selectors.nextPathMatchingRoutes
        > = yield select(selectors.nextPathMatchingRoutes)

        const oldMatchingRouteMap: ReturnType<
          typeof selectors.activePathMatchingRouteMap
        > = yield select(selectors.activePathMatchingRouteMap)
        const oldMatchingRoutes: ReturnType<
          typeof selectors.activePathMatchingRoutes
        > = yield select(selectors.activePathMatchingRoutes)
        const noLongerMatchingRoutes = oldMatchingRoutes.filter(
          r => !matchingRouteMap[r]
        )
        const newlyMatchingRoutes = matchingRoutes.filter(
          r => !oldMatchingRouteMap[r]
        )
        // console.log('-------> matching routes', {
        //   matchingRoutes,
        //   oldMatchingRoutes,
        //   newlyMatchingRoutes,
        //   noLongerMatchingRoutes,
        //   allRoutes
        // })
        const bundles: {
          pack: IRouteOptions<any>
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
        // no more yield here, react can't have another chance to interact with state
        const reducers = [
          currentReducerObject,
          ...bundles.map(c => c.pack.reducer)
        ]
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
        // console.log('<----------- path switch complete')
      }
    }
  })
  const createSubRoute = <
    IParentState extends ReducerObj,
    ParentRouteProps extends IRouteLimitations = {}
  >(
    parentRoute: IRouteComposer<ParentRouteProps>
  ) => <
    ISubState extends ReducerObj,
    RouteProps extends Partial<ParentRouteProps> = {}
  >(
    route: IRouteComposer<RouteProps> | string,
    routeCreator: IRouteOptionsCreator<ISubState, IParentState>,
    options: ICreateRouteOptions = {}
  ) => {
    const { onRouteMatch = () => null } = options
    if (typeof route === 'string') route = createRouteComposer<{}>(route)
    const combinedRoute = [parentRoute.route, route.route].join('/')
    type IFullRouteProps = RouteProps & ParentRouteProps
    const routeComposer = createRouteComposer<IFullRouteProps>(combinedRoute)
    routeMap[combinedRoute] = {
      onRouteMatch,
      route: routeComposer,
      parent: routeMap[parentRoute.route],
      loader: routeCreator
    }
    store.dispatch(addUserRoute(combinedRoute))
    type CompleteState = ReducerToState<ISubState> & IParentState
    const subRoute = {
      Link: createLink(history, routeComposer),
      routeComposer,
      fullRoute: combinedRoute,
      routeSegment: route,
      getState: () => (store.getState() as any) as CompleteState,
      baseSelector: (s: CompleteState) => s,
      connect: <T, OwnProps, H>(
        mapStateToProps: (state: CompleteState, ownProps: OwnProps) => T,
        handlers?: H
      ) =>
        connect(
          mapStateToProps,
          handlers
        ),
      createSubRoute: createSubRoute<CompleteState, IFullRouteProps>(
        routeComposer
      )
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
            component
          },
          store,
          render,
          {
            onMount: r
          }
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
