import { app } from "../../index";
import { createRouteComposer } from "action-packed-react/routeMatcher";

export const welcomeRoute = app.createSubRoute(
  createRouteComposer("users"),
  {
    reducer: async () => ({ users: (await import('./userListReducer')).default })
  },
);
welcomeRoute.setComponent(async () => (await import("./welcomeComponent")).default)
welcomeRoute.register();

