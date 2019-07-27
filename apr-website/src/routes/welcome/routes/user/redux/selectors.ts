import { welcomeRoute } from "../../../";
import { userRoute } from "../";
import { createSelector } from "reselect";
export const selectedUser = createSelector(
  userRoute.paramSelector,
  welcomeRoute.baseSelector,
  (params, state) => state.users[params.id]
);
