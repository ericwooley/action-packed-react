---
to: src/index.tsx
---
import * as React from "react";
import { createApp } from "action-packed-react";
import { createHashHistory } from "history";
import { render, unmountComponentAtNode } from "react-dom";
import { defaultInitialState, defaultReducers } from "./redux";
const el = document.getElementById("root");
if (!el) throw new Error("no el");

const renderApp = (jsx: JSX.Element) => {
  render(jsx, el);
  return () => unmountComponentAtNode(el);
};
const history = createHashHistory();

export const app = createApp({
  composeEnhancers: (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__,
  history,
  initialState: defaultInitialState,
  initialReducers: defaultReducers,
  RouteNotFoundComponent: () => <div>Not Found</div>,
  LoadingComponent: () => <h3>Loading...</h3>,
  render: renderApp,
  saga: import('./redux/sagas/index'),
  layout: import("./components/RootLayout")
});

app.init().catch(e => console.error("Error Starting application", e));
