import { createStore, combineReducers, Reducer } from 'redux'
import { Connect } from 'react-redux'
import { History } from 'history'
import { ReactNode } from 'react'
export interface IHaveType {
  type: string
}

export interface IReducerBundle<SubState> {
  initialState: SubState
  reducer: (action: IHaveType, state: SubState) => SubState
  handlers: { [k: string]: (action: IHaveType, state: SubState) => SubState }
}

export interface IOptions<T, Keys extends keyof T, BaseState> {
  initialState?: BaseState
  initialReducers: { [k in Keys]: IReducerBundle<any>[] }
  history: History
  rootEl: HTMLElement
}

export interface IRouteOptions<T> {
  component: ReactNode
  saga: AsyncIterableIterator<any>
  reducer: Reducer<T>
}

export interface IRouteOptionsCreator<T> {
  (connectComponent: Connect): IRouteOptions<T>
}

export interface IRoutesMap {
  [k: string]: IRouteOptionsCreator<any>
}
export function init<T, Keys extends keyof T, BaseState>({
  initialState,
  initialReducers,
  history
}: IOptions<T, Keys, BaseState>) {
  const store = createStore(
    combineReducers({
      _history: () => ({})
    }),
    initialState || {}
  )
  const routesMap: IRoutesMap = {}
  const createSubRoute = <ISubState>(parentRoute: string) => (
    route: string,
    routeOptions: IRouteOptionsCreator<ISubState>
  ) => {
    const combinedRoute = [parentRoute, route].join('/')
    routesMap[combinedRoute] = routeOptions
    return {
      createSubRoute: createSubRoute(combinedRoute)
    }
  }
  const unlisten = history.listen((location, action) => {
    //
  })
  return { createSubRoute: createSubRoute(''), store }
}
