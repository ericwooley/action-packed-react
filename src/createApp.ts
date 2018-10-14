import { createStore, combineReducers, Reducer } from 'redux'
import { History } from 'history'
import { mount, IRender } from './RouteMounter'
import { routeReducer, updateHistory } from './routeReducer'
import { connect } from 'react-redux'
import * as telegraph from 'telegraph-events'

export interface IHaveType {
  type: string
}

export interface IReducerBundle<SubState> {
  initialState: SubState
  reducer: (state: SubState, action: IHaveType) => SubState
  handlers: { [k: string]: (state: SubState, action: IHaveType) => SubState }
}

export interface IOptions<
  R extends { [key: string]: Reducer<any> },
  State extends ReducerToState<R> = ReducerToState<R>
> {
  initialState: State
  initialReducers: R
  history: History
  rootEl?: HTMLElement
  onMount?: () => any
  render: IRender
}

export interface IRouteOptions<T extends ReducerObj> {
  component: React.ComponentType<any>
  saga?: AsyncIterableIterator<any>
  reducer: T
  initialState?: ReducerToState<T>
}

export interface IRouteOptionsCreator<
  AdditionalState extends ReducerObj,
  ParentState extends ReducerObj
> {
  (): Promise<IRouteOptions<AdditionalState & Partial<ParentState>>>
}

export interface IRoutesMapValue {
  route: string
  parent?: IRoutesMapValue
  loader: IRouteOptionsCreator<any, any>
  onRouteMatch: () => any
  onMount: () => any
  onUnMount: () => any
}
export interface IRoutesMap {
  [k: string]: IRoutesMapValue
}
const reducerBase = { _route: routeReducer }
export type BareBonesState = ReducerToState<typeof reducerBase>
export enum EVENTS {
  ROUTE_MAP_UPDATE = 'ROUTE_MAP_UPDATE'
}
interface ICreateRouteOptions {
  onRouteMatch?: () => any
  onMount?: () => any
  onUnMount?: () => any
}
export function createApp<R extends { [key: string]: Reducer }>({
  initialState,
  initialReducers,
  history,
  render
}: IOptions<R>) {
  const emitter: Telegraph.Emitter<EVENTS> = telegraph()
  const alwaysReducerObject = Object.assign({}, reducerBase, initialReducers)
  const store = createStore(combineReducers(alwaysReducerObject), initialState)
  type IInitialState = BareBonesState & ReducerToState<R>
  const routeMap: IRoutesMap = {}
  const createSubRoute = <IParentState extends ReducerObj>(
    parentRoute: string
  ) => <ISubState extends ReducerObj>(
    route: string,
    routeCreator: IRouteOptionsCreator<ISubState, IParentState>,
    options: ICreateRouteOptions = {}
  ) => {
    const {
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
    emitter.emit(EVENTS.ROUTE_MAP_UPDATE, routeMap)
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
      emitter.off()
    },
    init: () =>
      new Promise(r => {
        mount(
          {
            emitter,
            pathname: '',
            routeMap,
            onRouteMatch: routes =>
              routes.map(r => routeMap[r]).forEach(pack => pack.onRouteMatch()),
            onPackLoaded: packs => {
              const reducers = [
                alwaysReducerObject,
                ...packs.map(c => c.reducer)
              ]
              const combined = Object.assign({}, ...reducers)
              const reducer = combineReducers(combined)
              store.replaceReducer(reducer as any)
            },
            onMount: route => {
              console.log('on mount', route, routeMap[route])
              if (routeMap[route]) {
                routeMap[route].onMount()
              }
            },
            onUnMount: route => {
              if (routeMap[route]) {
                routeMap[route].onUnMount()
              }
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
    store,
    baseSelector: (s: IInitialState) => s
  }
}

export type ReducerObj = { [key: string]: Reducer<any, any> }
export type ReducerToState<T extends ReducerObj> = {
  [K in keyof T]: ReturnType<T[K]>
}
