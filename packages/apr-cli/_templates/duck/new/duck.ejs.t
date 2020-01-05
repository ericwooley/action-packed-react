---
to: <%=route%>/redux/ducks/<%= name %>/<%= name %>.ts
---
import { createActionPack, createReducerFromActionPack } from "action-packed-react";

const ns = (type: string) => `<%=route%>/<%= name %>/${type}`

export const initialState = { };

type UIState = typeof initialState;
export const <%= name %> = createReducerFromActionPack(initialState, {
  reset: createActionPack<UIState>(ns("RESET"), () => initialState)
});
