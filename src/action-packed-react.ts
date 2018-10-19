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
  addUserRoute
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
import { take, select, all, call } from 'redux-saga/effects'

const reducerBase = { _route: routeReducer }
export type BareBonesState = ReducerToState<typeof reducerBase>
export function createApp<R extends { [key: string]: Reducer }>({
  initialState,
  initialReducers,
  history,
  render,
  component
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
    let oldMatchingRoutes: string[] = []
    let oldMatchingRouteMap: ReturnType<typeof selectors.matchingRouteMap> = {}
    while (true) {
      yield take(updateHistory._type)
      const matchingRouteMap: ReturnType<
        typeof selectors.matchingRouteMap
      > = yield select(selectors.matchingRouteMap)
      const matchingRoutes: ReturnType<
        typeof selectors.matchingRoutes
      > = yield select(selectors.matchingRoutes)
      const noLongerMatchingRoutes = oldMatchingRoutes.filter(
        r => !matchingRouteMap[r]
      )
      const newlyMatchingRoutes = oldMatchingRoutes.filter(
        r => !oldMatchingRouteMap[r]
      )
      oldMatchingRoutes = matchingRoutes
      yield all(
        noLongerMatchingRoutes
          .map(route => async () => {
            const packLoader = routeMap[route]
            if (!packLoader) return
            const pack = await packLoader.loader()
            if (pack.reducer) {
              currentReducerObject = Object.keys(pack.reducer).reduce(
                (reducer, key) => {
                  reducer[key] = () => null
                  return reducer
                },
                { ...(currentReducerObject as any) }
              )
              const reducer = combineReducers(currentReducerObject)
              store.replaceReducer(reducer)
              store.dispatch({
                type: `UNMOUNT_${route}`
              })
            }
          })
          .map(call)
      )
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
      const reducers = [
        currentReducerObject,
        ...bundles.map(c => c.pack.reducer)
      ]
      currentReducerObject = Object.assign({}, ...reducers)
      yield call(store.replaceReducer, combineReducers(currentReducerObject))
    }
  })
  const createSubRoute = <IParentState extends ReducerObj>(
    parentRoute: string
  ) => <ISubState extends ReducerObj>(
    route: string,
    routeCreator: IRouteOptionsCreator<ISubState, IParentState>,
    options: ICreateRouteOptions = {}
  ) => {
    const { onRouteMatch = () => null } = options
    const combinedRoute = [parentRoute, route].join('/')
    routeMap[combinedRoute] = {
      onRouteMatch,
      route: route,
      parent: routeMap[parentRoute],
      loader: routeCreator
    }
    store.dispatch(addUserRoute(combinedRoute))
    type CompleteState = ReducerToState<ISubState> & IParentState
    const subRoute = {
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
      createSubRoute: createSubRoute<CompleteState>(combinedRoute)
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
    init: () =>
      new Promise(r => {
        console.log('routes', routeMap)
        mount(
          {
            pathname: '',
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
      }),
    createSubRoute: createSubRoute<IInitialState>(''),
    store: store as Store<IInitialState>,
    baseSelector: (s: IInitialState) => s
  }
}
