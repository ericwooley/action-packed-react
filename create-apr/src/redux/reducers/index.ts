import { createActionPack, createReducerFromActionPack } from "action-packed-react/createReducer";

export const initialState = {
  welcomeConfirmed: false
};

type UIState = typeof initialState;
export default createReducerFromActionPack(initialState, {
  confirmWelcome: createActionPack<UIState, boolean>("CONFIRM_WELCOME", (state, action) => ({
    ...state,
    welcomeConfirmed: action.payload
  }))
});
