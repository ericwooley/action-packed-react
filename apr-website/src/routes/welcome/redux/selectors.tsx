import { createSelector } from "reselect";
import { welcomeRoute } from "../index";
export const selectors = {
  userList: createSelector(
    welcomeRoute.baseSelector,
    state => Object.values(state.users)
  )
};
