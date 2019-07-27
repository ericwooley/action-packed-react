import { contactUsRoute } from './index'
import { createActionPack, createReducerFromActionPack } from 'action-packed-react/createReducer'
import { createSelector } from 'reselect';



const initialState = {
  email: '',
  message: '',
  phoneNumber: '',
}
type ContactUsState = typeof initialState

export default createReducerFromActionPack(initialState, {
  setEmail: createActionPack<ContactUsState, string>('SET_EMAIL', (state, action) =>
    ({ ...state, email: action.payload }))
})

export const selectors = {
  email: createSelector(contactUsRoute.baseSelector, (state) => state.contactUs.email),
  message: createSelector(contactUsRoute.baseSelector, (state) => state.contactUs.message)
}
