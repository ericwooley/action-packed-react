import * as React from 'react'
import { createApp, BareBonesState } from './action-packed-react'
import { createMemoryHistory } from 'history'
import { mount, render, ReactWrapper } from 'enzyme'
import { Provider } from 'react-redux'
import { createActionPack, createReducerFromActionPack } from './createReducer'
import { createRouteComposer } from './routeMatcher'
const Layout = (props: { children: any }) => (
  <div>
    <h1>Layout</h1>
    {props.children}
  </div>
)

const InnerLayout = (props: { children: any }) => (
  <div>
    <h1>Layout</h1>
    {props.children}
  </div>
)
describe('basic test', () => {
  it('should be usable', () => {
    const history = createMemoryHistory()
    // (window as any).hist = history;
    const app = createApp({
      importBaseComponent: Layout,
      history,
      initialState: {
        str: '',
        num: 15
      },
      initialReducers: {
        str: () => 'test',
        num: () => 12
      },
      render: jsx => {
        const wrapper = mount(jsx)
        return () => null
      }
    })
    app.init()
    // (window as any).app = app;
    // console.log("state", app.store.getState());

    const subRoute2 = app.createSubRoute(
      createRouteComposer<{}>('test'),
      async () => ({
        component: InnerLayout,
        reducer: {}
      })
    )

    const subRotue3 = subRoute2.createSubRoute(
      createRouteComposer('test2'),
      async () => ({
        reducer: {},
        component: (props: any) => (
          <div>
            <h1>Waldows World</h1>
            {props.children}
          </div>
        )
      })
    )
  })
})
