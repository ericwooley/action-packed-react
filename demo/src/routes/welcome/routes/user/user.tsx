import * as React from "react";
import { welcomeRoute } from "../../welcome";
import { createRouteComposer, createReducerFromActionPack, createActionPack } from "action-packed-react";

const defaultState = {
  name: 'steve'
}

const updateName = createActionPack<typeof defaultState, string>('UPDATE_NAME', (state, action) => ({
  ...state,
  name: action.payload
}))
export const userRoute = welcomeRoute.createSubRoute(
  createRouteComposer<{name: string}>(":name"),
  async () => {
    return {
      component: (props: {params: {name: string}}) => <pre>{JSON.stringify(props, null, 2)}</pre>,
      reducer: { steve: createReducerFromActionPack(defaultState, [updateName]) }
    };
  }
);
