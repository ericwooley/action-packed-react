import { createStore, combineReducers, Reducer, Store } from 'redux'
import { mount } from './RouteMounter'
import {
  routeReducer,
  updateHistory,
  initialState as routeInitialState
} from './routeReducer'
import { connect } from 'react-redux'
import {
  ReducerToState,
  IOptions,
  IRoutesMap,
  ReducerObj,
  IRouteOptionsCreator,
  ICreateRouteOptions
} from './types'

const reducerBase = { _route: routeReducer }
export type BareBonesState = ReducerToState<typeof reducerBase>
export function createApp<R extends { [key: string]: Reducer }>({
  initialState,
  initialReducers,
  history,
  render
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
  const store = createStore(
    combineReducers(currentReducerObject),
    combinedInitialState
  )
  const routeMap: IRoutesMap = {}
  const createSubRoute = <IParentState extends ReducerObj>(
    parentRoute: string
  ) => <ISubState extends ReducerObj>(
    route: string,
    routeCreator: IRouteOptionsCreator<ISubState, IParentState>,
    options: ICreateRouteOptions = {}
  ) => {
    const {
      /* istanbul ignore next */
      onRouteMatch = () => null,
      onMount = () => null,
      onUnMount = () => null
    } = options
    const combinedRoute = [parentRoute, route].join('/')
    routeMap[combinedRoute] = {
      onRouteMatch,
      onMount,
      onUnMount,
      route: route,
      parent: routeMap[parentRoute],
      loader: routeCreator
    }
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
        mount(
          {
            pathname: '',
            routeMap,
            onRouteMatch: routes =>
              routes.map(r => routeMap[r]).forEach(pack => pack.onRouteMatch()),
            onPackLoaded: packs => {
              const reducers = [
                currentReducerObject,
                ...packs.map(c => c.reducer)
              ]
              currentReducerObject = Object.assign({}, ...reducers)
              const reducer = combineReducers(currentReducerObject)
              store.replaceReducer(reducer)
            },
            onMount: route => {
              routeMap[route].onMount()
            },
            onUnMount: (route, pack) => {
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
              routeMap[route].onUnMount()
            }
          },
          store,
          render,
          {
            onMount: r
          }
        )
      }),
    createSubRoute: createSubRoute<IInitialState>(''),
    store: store as Store<IInitialState>,
    baseSelector: (s: IInitialState) => s
  }
}
