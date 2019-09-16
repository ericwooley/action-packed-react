---
to: src/route.tsx
---
import * as React from "react";
import { createApp } from "action-packed-react";
import { History } from "history";
import initialReducers, { initialState } from "./redux/ducks";

export const routeFactory = ({ history }: { history: History }) => {
  const app = createApp({
    composeEnhancers: (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__,
    history,
    initialState,
    initialReducers,
    RouteNotFoundComponent: () => <div>Not Found</div>,
    LoadingComponent: () => <h3>Loading...</h3>,
    saga: import("./redux/sagas/index"),
    layout: import("./components/RootLayout")
  });

  app.init().catch(e => console.error("Error Starting application", e));
  return app;
};
export type Parent = ReturnType<typeof routeFactory>;


