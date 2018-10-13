import { createStore, combineReducers, Reducer } from 'redux'
import { History } from 'history'
import { mount } from './RouteMounter'
import { historyReducer } from './routeReducer'
import { connect } from 'react-redux'

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
  rootEl: HTMLElement
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
export function init<R extends { [key: string]: Reducer }>({
  initialState,
  initialReducers,
  history,
  rootEl
}: IOptions<R>) {
  const reducerBase = { _history: historyReducer }
  const reducer = Object.assign(reducerBase, initialReducers)
  const store = createStore(combineReducers(reducer), initialState)
  type IInitialState = ReducerToState<typeof reducerBase> & ReducerToState<R>
  const routeMap: IRoutesMap = {}

  const createSubRoute = <IParentState extends ReducerObj>(
    parentRoute: string
  ) => <ISubState extends ReducerObj>(
    route: string,
    routeCreator: IRouteOptionsCreator<ISubState, IParentState>
  ) => {
    const combinedRoute = [parentRoute, route].join('/')
    routeMap[combinedRoute] = routeCreator
    type CompleteState = ReducerToState<ISubState> & IParentState
    return {
      connect: <T, OwnProps, H>(
        mapStateToProps: (state: CompleteState, ownProps: OwnProps) => T,
        handlers: H
      ) =>
        connect(
          mapStateToProps,
          handlers
        ),
      createSubRoute: createSubRoute<CompleteState>(combinedRoute)
    }
  }

  const unlisten = history.listen((location, action) => {
    //
  })
  return {
    init: () =>
      mount(
        rootEl,
        {
          routeMap,
          route: store.getState()._history
        },
        store
      ),
    createSubRoute: createSubRoute<IInitialState>(''),
    store
  }
}

export type ReducerObj = { [key: string]: Reducer<any, any> }
export type ReducerToState<T extends ReducerObj> = {
  [K in keyof T]: ReturnType<T[K]>
}
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
