import { initialState } from './routeReducer';
import { History, Action } from 'history'
import { Reducer, compose } from 'redux'
import { IRouteComposer } from './routeMatcher'
import { IPathMatcherProps } from './RouteMounter'
export type Saga = () => IterableIterator<any>
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
  activeRoute: string
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
  useHashHistory?: boolean
  initialReducers: R
  history: History
  rootEl?: HTMLElement
  onMount?: () => any
  RouteNotFoundComponent: React.ComponentType<Partial<IPathMatcherProps>>
  LoadingComponent: React.ComponentType<Partial<IPathMatcherProps>>
  layout:
    | React.ComponentType
    | (Promise<(React.ComponentType) | ({ default: React.ComponentType })>)
  saga?: Saga | Promise<{ default: Saga } | Saga>
  composeEnhancers?: typeof compose
  baseRoute?: string
}

export interface IRouteOptions<T extends ReducerObj, U> {
  component: React.ComponentType<U>
  saga: Saga
  routeComposer: IRouteComposer<any>
  reducer: T
  initialState?: ReducerToState<T>
  onStateCleared?: () => any
}

export interface IRouteOptionsCreator<
  AdditionalState extends ReducerObj,
  ParentState extends ReducerObj,
  ComponentProps
> {
  (): Promise<IRouteOptions<AdditionalState & Partial<ParentState>, ComponentProps>>
}

export interface IRoutesMapValue {
  route: IRouteComposer<any>
  parent?: IRoutesMapValue
  initialState?: object,
  loader: IRouteOptionsCreator<any, any, any>
  onRouteMatch: () => any
}
export interface IRoutesMap {
  [k: string]: IRoutesMapValue
}

export type ReducerObj = { [key: string]: Reducer<any, any> }
export type ReducerToState<T extends ReducerObj> = {
  [K in keyof T]: ReturnType<T[K]>
}

export interface ICreateRouteOptions<InitialState> {
  initialState?: InitialState
  onRouteMatch?: () => any
  onMount?: () => any
  onUnMount?: () => any
}