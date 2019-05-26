import { app } from "../../index";
import { createRouteComposer } from "action-packed-react";

export const welcomeRoute = app.createSubRoute(
  createRouteComposer("users"),
  {
    component: async () => (await import("./welcomeComponent") as any).default,
    reducer: async () => ({ users: (await import('./userListReducer')).default })
  },
);

