import {delay, cancelled} from 'redux-saga/effects'

export function * rootSaga () {
  console.log("Running root saga");
  const tickId = Math.floor(Math.random() * 1000)
  let count = 0
  try {
    while (++count < 10) {
      console.log(count, 'tick', tickId)
      yield delay(1000)
    }
    console.log(count, 'let me die!', tickId)
  } finally {
    if (yield cancelled()) {
      console.log(count, "I was murdered!", tickId);
    }
  }
}
