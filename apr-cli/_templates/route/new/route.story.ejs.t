---
to: <%=route%>/routes/<%=name%>/route.story.tsx
---
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { route as parent } from "../../route.story";
import <%=name %>Route from "./route";

export const route = <%=name %>Route(parent);
const AppComponent = route.navigateOnMount({}, true)
storiesOf("app<%= route.replace(/^\/?src\/?/g, '').replace(/routes\//g, '') %>/<%=name%>", module)
  .add("Default Route", () => {
    return <AppComponent />;
  });

