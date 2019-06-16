import { app } from "../../index";
import { createRouteComposer } from "action-packed-react/routeMatcher";

export const contactUsRoute = app.createSubRoute(createRouteComposer("contact-us"), async () => ({
  contactUs: (await import("./contactUsReducer")).default
}));
contactUsRoute.setComponent(async () => (await import("./contactUs")).default);
contactUsRoute.register();
