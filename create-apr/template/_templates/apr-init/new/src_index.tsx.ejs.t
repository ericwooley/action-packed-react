---
to: src/index.tsx
---
import { appFactory } from "./app";
import { render, unmountComponentAtNode } from "react-dom";
import { createHashHistory } from "history";
const el = document.getElementById("root");
if (!el) throw new Error("no el");

const renderApp = (jsx: JSX.Element) => {
  render(jsx, el);
  return () => unmountComponentAtNode(el);
};

export const app = appFactory(renderApp, {history: createHashHistory()});

