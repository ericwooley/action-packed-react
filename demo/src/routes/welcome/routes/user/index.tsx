import { welcomeRoute } from "../..";
import { createRouteComposer } from "action-packed-react/routeMatcher";

export type IParams = {
  id: string
}
export const userRoute = welcomeRoute.createSubRoute(
  createRouteComposer<IParams>(":id"),
  {
    reducer: async () => ({
      test: () => ({})
    })
  }
);
userRoute.setComponent(async () =>  (await import('./components/userProfile') as any).userProfile)

export type UserRoute = typeof userRoute
