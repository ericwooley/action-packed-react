---
to: src/route.tsx
---
import * as React from "react";
import {
  createApp,
  createStore,
  IRouteComponentProps,
  createRouteComposer
} from "action-packed-react";
import { History } from "history";
import initialReducers, { initialState } from "./redux/ducks";
import "./global.css";

export type RouteParams = {}
export type RouteProps = IRouteComponentProps<RouteParams>;
export const route = createRouteComposer<RouteParams>("/");

export const {store,...bundle} = createStore({
  initialState,
  initialReducers,
});

export const routeFactory = ({ history }: { history: History }) => {
  const app = createApp({
    store,
    ...bundle,
    composeEnhancers: (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__,
    history,
    RouteNotFoundComponent: () => <div>Not Found</div>,
    LoadingComponent: () => <h3>Loading...</h3>,
    saga: import("./redux/sagas/index"),
    layout: import("./components/RootLayout")
  });

  app.init().catch(e => console.error("Error Starting application", e));
  return app;
};
export type Parent = ReturnType<typeof routeFactory>;


