import { app } from "../../index";
import { createRouteComposer } from "action-packed-react";

export const welcomeRoute = app.createSubRoute(
  createRouteComposer<{}>("welcome/:name"),
  async () => {
    return {
      component: (await import(/* webpackChunkName: "welcomeComponent" */ "./welcomeComponent"))
        .Welcome,
      reducer: {
        name: () => "steve"
      }
    };
  }
);
