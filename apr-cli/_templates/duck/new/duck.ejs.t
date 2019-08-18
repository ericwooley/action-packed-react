---
to: <%=route%>/redux/ducks/<%= name %>/<%= name %>.ts
---
import { createActionPack, createReducerFromActionPack } from "action-packed-react/createReducer";

const ns = (type: string) => `<%=route%>/<%= name %>/${type}`

export const initialState = {
  confirmed: false
};

type UIState = typeof initialState;
export const <%= h.changeCase.pascal(name) %> = createReducerFromActionPack(initialState, {
  confirm: createActionPack<UIState, boolean>(ns("CONFIRM"), (state, action) => ({
    ...state,
    confirmed: action.payload
  }))
});
