import { createReducerFromActionPack, createActionPack } from './createReducer'
import { IRouteState, IRouteStatus } from './types'
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

export const routeReducer = createReducerFromActionPack(initialState, [
  updateHistory
])
