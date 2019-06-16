import * as React from "react";
import { createApp } from "action-packed-react";
import { createHashHistory } from "history";
import { render, unmountComponentAtNode } from "react-dom";

const el = document.getElementById("root");
if (!el) throw new Error("no el");

const renderApp = (jsx: JSX.Element) => {
  render(jsx, el);
  return () => unmountComponentAtNode(el);
};
const history = createHashHistory();

export const app = createApp({
  importBaseComponent: import('./layout').then(({ RootLayout }) => RootLayout),
  history,
  initialState: {
    str: "",
    num: 15
  },
  initialReducers: {
    str: () => "test",
    num: () => 12
  },
  RouteNotFoundComponent: () => <div>Not Found</div>,
  LoadingComponent: () => <h3>Loading...</h3>,
  render: renderApp,
  composeEnhancers: (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
});

app.init().catch((e) => console.warn('Error Starting application', e))
