---
to: src/route.story.tsx
---
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { routeFactory } from "./route";
import { createMemoryHistory } from "history";

// this is a gross hack, until i make a storybook addon
// to handle this gracefully

let onMount: () => void = () => {};
let appJsx: null | React.ReactElement = null;

export const history = createMemoryHistory();
export const route = routeFactory(
  jsx => {
    appJsx = jsx;
    console.log("trigger re-render");
    onMount();
    return () => {
      appJsx = null as any;
    };
  },
  { history }
);

export class AppStory extends React.Component {
  componentDidMount() {
    onMount = this.forceUpdate;
  }
  componentWillUnmount() {
    onMount = () => {};
  }

  render() {
    return appJsx;
  }
}
storiesOf("app", module).add("with text", () => <AppStory />);
