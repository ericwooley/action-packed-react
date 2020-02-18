---
to: <%=route%>/redux/sagas/<%= name %>.ts
---
import { call } from 'redux-saga/effects';

export function* <%= name %> () {
  yield call(() => console.log('my new saga'));
}
