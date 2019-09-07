---
to: <%=route%>/routes/<%=name%>/route.story.tsx
---
import * as React from "react";
import { storiesOf } from "@storybook/react";
import {AppStory, history } from 'app/route.story'
import { route as parent } from "../../route.story";
import <%=name %>Route from "./route";
export const route = <%=name %>Route(parent);

class NavigateOnMount extends React.Component {
  componentDidMount() {
    history.push(route.routeComposer.createUrl({}));
  }
  render () {
    return <AppStory />
  }
}
storiesOf("app/<%= route.replace(/^\/?src\/?/g, '').replace(/routes\//g, '') %>/<%=name%>", module).add("with text", () => {
  return <NavigateOnMount />;
});
