import { createReducerFromActionPack, createActionPack } from './createReducer'

export interface IRouteState {
  pathname: string
  search: string
  hash: string
}

const initialState: IRouteState = {
  pathname: '',
  search: '',
  hash: ''
}

export const updateHistory = createActionPack<IRouteState, IRouteState>(
  '@TWW/updateLocation',
  (state, action) => ({
    ...state,
    ...action.payload
  })
)

export const reducer = createReducerFromActionPack(initialState, [
  updateHistory
])
