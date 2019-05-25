import * as React from "react";
import { createApp, createRouteComposer } from "action-packed-react";
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


const InnerLayout = (props: { children: any, params: any }) => (
  <div>
    <h1>Layout</h1>
    {props.children}
  </div>
);

const subRoute2 = app.createSubRoute(
  createRouteComposer<any>("test"),
  async () => ({
    component: InnerLayout,
    reducer: {}
  })
);

type ISubRoute3Params = {id: string}
type ISubRoute3Props = {
  params: ISubRoute3Params,
  children: React.ReactElement
}
// should not be any...
const subRoute3 = subRoute2.createSubRoute(
  createRouteComposer<ISubRoute3Params>("test/:id"),
  async () => ({
    reducer: {},
    component: (props: ISubRoute3Props) => (
      <div>
        <h1>Waldows World {props.params.id}</h1>
        {props.children}
      </div>
    )
  })
);

subRoute3.createSubRoute(
  createRouteComposer<{ id: string }>("test/:id"),
  async () => ({
    reducer: {},
    component: (props) => (
      <div>
        <h1>Waldows World</h1>
        {props.children}
      </div>
    )
  })
);
app.init()
