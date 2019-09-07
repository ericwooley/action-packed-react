---
to: src/index.tsx
---
import { routeFactory } from "./route";
import { render, unmountComponentAtNode } from "react-dom";
import { createHashHistory } from "history";
const el = document.getElementById("root");
if (!el) throw new Error("no el");

const renderApp = (jsx: JSX.Element) => {
  render(jsx, el);
  return () => unmountComponentAtNode(el);
};

export default routeFactory(renderApp, {history: createHashHistory()});
