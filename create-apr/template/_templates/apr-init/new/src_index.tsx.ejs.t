---
to: src/index.tsx
---
import * as React from "react";
import { routeFactory } from "./route";
import { render, unmountComponentAtNode } from "react-dom";
import { createHashHistory } from "history";
const el = document.getElementById("root");
if (!el) throw new Error("no el");

const app = routeFactory({ history: createHashHistory() });

render(<app.AppComponent />, el);
export default app
