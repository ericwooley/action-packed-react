---
to: src/app.story.tsx
---
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { appFactory } from "./app";
import { createMemoryHistory } from "history";

class AppStory extends React.Component {
  appJsx: React.ReactElement | null = null;
  componentDidMount() {
    appFactory(
      appJsx => {
        this.appJsx = appJsx;
        this.forceUpdate();
        return () => {
          this.appJsx = null;
        };
      },
      { history: createMemoryHistory() }
    );
  }
  render() {
    return this.appJsx;
  }
}
storiesOf("app", module).add("with text", () => <AppStory />);

