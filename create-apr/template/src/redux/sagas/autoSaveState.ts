import { app } from "../..";
import { race, delay, take, call, select } from "redux-saga/effects";
import { eventChannel } from "redux-saga";

/**
 * Redux saga event channel to listen to any events by the user.
 */
function userEvent() {
  return eventChannel(emitter => {
    document.addEventListener("keypress", emitter);
    document.addEventListener("mousemove", emitter);
    document.addEventListener("mousedown", emitter);
    return () => {
      document.removeEventListener("keypress", emitter);
      document.removeEventListener("mousemove", emitter);
      document.removeEventListener("mousedown", emitter);
    };
  });
}

export default ({
  // Amount of time to wait with no actions, and no user input before saving
  // state to local storage.
  SECONDS_TO_SAVE_STATE = 1
} = {}) =>
  function* autoSaveState() {
    const chan = yield call(userEvent);
    try {
      // Sagas can go forever, without an infinite loop, as long as they are
      // yielding to something.
      while (true) {
        // This is a race between the 3 events, the first event to happen
        // cancels the other events. The return of the race is as follows:
        // 1. A redux action occurred resulting in:
        //    {cancelledByAction: <the action>}
        // 2. A use moved the mouse or pressed a key triggering an event
        //    on the channel, resulting in:
        //    {cancelledByUserEvent: <event>}
        // 3. The delay happened, (the other two didn't happen for X seconds)
        //    Resulting in:
        //    {shouldSave: <effect descriptor>}
        const { shouldSave } = yield race({
          cancelledByAction: take(() => true),
          cancelledByUserEvent: take(chan),
          shouldSave: delay(SECONDS_TO_SAVE_STATE * 1000)
        });
        // shouldSave being truthy means that no redux actions, or user events
        // happened for X seconds
        if (shouldSave) {
          // select all state from our app
          const allState = yield select(app.baseSelector);
          // store it in local storage
          localStorage.setItem("saved-state", JSON.stringify(allState));
        }
      }
    } finally {
      // Something killed our saga.
      console.log("No longer saving state");
    }
  };
