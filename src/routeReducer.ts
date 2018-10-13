import { createReducerFromActionPack, createActionPack } from './createReducer'
import { Action } from 'history'

export interface IRouteStatus {
  pathname: string
  search: string
  hash: string
  action: Action
  key?: string
  state?: any
}
export interface IRouteState extends IRouteStatus {
  history: IRouteStatus[]
}

export const initialState: IRouteState = {
  history: [],
  pathname: '',
  search: '',
  hash: '',
  action: 'PUSH'
}

export const updateHistory = createActionPack<IRouteState, IRouteStatus>(
  '@TWW/updateLocation',
  (state, action) => {
    const { history, ...restState } = state
    return {
      ...state,
      history: [...state.history, restState],
      ...action.payload
    }
  }
)

export const routeReducer = createReducerFromActionPack(initialState, [updateHistory])
