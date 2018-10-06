import { init } from "./fe";
import { createMemoryHistory } from "history";

describe('the wooley way fe', () => {
  it('should look like this', () => {
    const app: any = init({
      initialReducers: {},
      history: createMemoryHistory(),
      rootEl: document.createElement('div')
    })
    const friends = app.addRoute('friends', () => { component: HomeComponent, saga: function* HomeSaga() { }, reducer: () => null })
    const profile = app.addRoute('profile/:id', () => { component: ProfileComponent, saga: function* Profile() { }, reducer: () => null })
  })
})
