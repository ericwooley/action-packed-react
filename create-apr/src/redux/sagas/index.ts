import { all } from "redux-saga/effects";
// import autoSaveState from './autoSaveState'

/**
 * rootSaga to load any global sagas you want.
 *
 * Included are some common ones, you just need to uncomment them.
 */
export default function* rootSaga() {
  console.log("saga initialized");
  yield all([
    // automatically save redux to local storage state after X (default: 1)
    // seconds of inactivity
    // autoSaveState()
  ]);
}
