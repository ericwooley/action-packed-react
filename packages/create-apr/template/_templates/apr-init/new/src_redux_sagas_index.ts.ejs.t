---
to: src/redux/sagas/index.ts
---
import { all } from "redux-saga/effects";

/**
 * rootSaga to load any global sagas you want.
 *
 * Included are some common ones, you just need to uncomment them.
 */
export default function* rootSaga() {
  console.log("saga initialized");
  yield all([
  ]);
}
