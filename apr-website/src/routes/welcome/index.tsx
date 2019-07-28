import { app } from "../../index";
import { createRouteComposer } from "action-packed-react/routeMatcher";

export const welcomeRoute = app.createSubRoute(createRouteComposer("users"), () =>
  import("./redux/index")
);
welcomeRoute.setComponent(() => import("./welcomeComponent"));
welcomeRoute.register();
