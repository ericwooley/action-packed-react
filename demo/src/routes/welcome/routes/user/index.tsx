import { welcomeRoute } from "../..";
import { createRouteComposer } from "action-packed-react/routeMatcher";

export interface IParams {
  id: string
}
export const userRoute = welcomeRoute.createSubRoute(
  createRouteComposer<IParams>(":id"),
  async () => ({
    test: () => ({})
  })
);
userRoute.setSaga(async () => (await import('./redux/saga')).rootSaga)
userRoute.setComponent(async () => (await import('./components/userProfile')).userProfile)
userRoute.register()
export type UserRoute = typeof userRoute
