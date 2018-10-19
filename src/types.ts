import { History, Action } from 'history'
import { Reducer } from 'redux'
// Should return a function that unmounts
export interface IRender {
  (c: React.ReactElement<any>): () => any
}
export interface IRouteStatus {
  pathname: string
  search: string
  hash: string
  action: Action
  key?: string
  state?: any
}
export interface IRouteState {
  history: IRouteStatus[]
  currentLocation: IRouteStatus
  userRoutes: string[]
}

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
}
export interface IRoutesMap {
  [k: string]: IRoutesMapValue
}

export type ReducerObj = { [key: string]: Reducer<any, any> }
export type ReducerToState<T extends ReducerObj> = {
  [K in keyof T]: ReturnType<T[K]>
}

export interface ICreateRouteOptions {
  onRouteMatch?: () => any
  onMount?: () => any
  onUnMount?: () => any
}
