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

export interface IRoutesMap {
  [k: string]: IRouteOptionsCreator<any, any>
}
const reducerBase = { _route: routeReducer }
export type BareBonesState = ReducerToState<typeof reducerBase>
export enum EVENTS {
  ROUTE_MAP_UPDATE = 'ROUTE_MAP_UPDATE'
}
export function createApp<R extends { [key: string]: Reducer }>({
  initialState,
  initialReducers,
  history,
  render
}: IOptions<R>) {
  const emitter = telegraph<EVENTS>()
  const reducer = Object.assign(reducerBase, initialReducers)
  const store = createStore(combineReducers(reducer), initialState)
  type IInitialState = BareBonesState & ReducerToState<R>
  const routeMap: IRoutesMap = {}
  let updateReactMounter = {
    updateRouteMap: (routes: IRoutesMap) => {
      // nothing to do here
    }
  }
  const createSubRoute = <IParentState extends ReducerObj>(parentRoute: string) => <
    ISubState extends ReducerObj
  >(
    route: string,
    routeCreator: IRouteOptionsCreator<ISubState, IParentState>
  ) => {
    const combinedRoute = [parentRoute, route].join('/')
    routeMap[combinedRoute] = routeCreator
    emitter.emit(EVENTS.ROUTE_MAP_UPDATE, routeMap)
    type CompleteState = ReducerToState<ISubState> & IParentState
    return {
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
    init: () =>
      new Promise(r => {
        mount(
          {
            routeMap
          },
          store,
          render,
          {
            onMount: r,
            emitter
          }
        )
      }),
    createSubRoute: createSubRoute<IInitialState>(''),
    store
  }
}

export type ReducerObj = { [key: string]: Reducer<any, any> }
export type ReducerToState<T extends ReducerObj> = { [K in keyof T]: ReturnType<T[K]> }
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
