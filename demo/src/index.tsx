import * as React from "react";
import { createApp, createRouteComposer } from "action-packed-react";
import { createHashHistory } from "history";
import { render, unmountComponentAtNode } from "react-dom";

const Layout = (props: { children: any }) => (
  <div>
    <h1>Layout</h1>
    <ul>
      <li>
        <subRoute2.Link test="some other test">Subroute 2</subRoute2.Link>
      </li>
      <li>
        <subRoute3.Link test="inner link">Subroute 3</subRoute3.Link>
      </li>
    </ul>
    {props.children}
  </div>
);

const InnerLayout = (props: { children: any }) => (
  <div>
    <h1>Layout</h1>
    {props.children}
  </div>
);

const el = document.getElementById("root");
if (!el) throw new Error("no el");

const renderApp = (jsx: JSX.Element) => {
  render(jsx, el);
  return () => unmountComponentAtNode(el);
};
const history = createHashHistory();

export const app = createApp({
  importBaseComponent: Layout,
  history,
  initialState: {
    str: "",
    num: 15
  },
  initialReducers: {
    str: () => "test",
    num: () => 12
  },
  render: renderApp
});
app.init();

const subRoute2 = app.createSubRoute(
  createRouteComposer<{ test: string }>("test/:test"),
  async () => ({
    component: InnerLayout,
    reducer: {
      thing: () => 'thing'
    }
  })
);

const subRoute3 = subRoute2.createSubRoute(
  createRouteComposer("test2"),
  async () => ({
    component: (props: any) => (
      <div>
        <h1>Waldows World</h1>
        {props.children}
      </div>
    )
  })
);
