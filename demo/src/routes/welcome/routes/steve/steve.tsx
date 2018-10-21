import * as React from "react";
import { welcomeRoute } from "../../welcome";
import { createRouteComposer } from "action-packed-react";

export const welcomeSteveRoute = welcomeRoute.createSubRoute(
  createRouteComposer<{ name: string }>(":name"),
  async () => {
    return {
      component: () => <p>steve</p>
    };
  }
);
