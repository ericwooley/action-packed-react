import { app } from "../../index";
import { createRouteComposer } from "action-packed-react";

export const welcomeRoute = app.createSubRoute(
  createRouteComposer<any>("users"),
  async () => {
    return {
      component: (await import(/* webpackChunkName: "welcomeComponent" */ "./welcomeComponent"))
        .Welcome,
      reducer: { }
    };
  }
);
