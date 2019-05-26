import { welcomeRoute } from "../..";
import { createRouteComposer } from "action-packed-react";

export type IParams = {
  id: string
}
export const userRoute = welcomeRoute.createSubRoute(
  createRouteComposer<IParams>(":id"),
  {
    component: async () =>  (await import('./components/userProfile') as any).userProfile,
    reducer: async () => ({
      test: () => ({})
    })
  }
);
const state = userRoute.baseSelector({} as any)

export type UserRoute = typeof userRoute
