import { createRouteComposer } from "action-packed-react/routeMatcher";
import { contactUsRoute } from "..";

const contactUsError = contactUsRoute.createSubRoute(
  createRouteComposer("test"),
  // $ExpectError
  async () => ({
    contactUs: () => null
  })
);
