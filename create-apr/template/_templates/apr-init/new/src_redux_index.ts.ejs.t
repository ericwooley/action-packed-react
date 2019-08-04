---
to: src/redux/index.ts
---
import ui, {initialState} from "./reducers";
export const defaultInitialState = {
  ui: initialState
}
export const defaultReducers = {
  ui
};
