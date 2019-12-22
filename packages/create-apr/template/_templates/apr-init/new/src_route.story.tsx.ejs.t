---
to: src/route.story.tsx
---
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { routeFactory } from "./route";
import { createMemoryHistory } from "history";

export const history = createMemoryHistory();
export const route = routeFactory(
  { history }
);

storiesOf("app", module).add("Root", () => <route.NavigateOnMount />);

