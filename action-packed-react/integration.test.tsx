import * as React from 'react'
import { createApp } from './'
import { createMemoryHistory } from 'history'
import { mount } from 'enzyme'
import { createRouteComposer } from './routeMatcher'

describe('basic test', () => {
  it('should be usable', () => {
    const Layout = (props: {children?: React.ReactNode}) => (
      <div>
        <h1>Layout</h1>
        <ul>
          <li>
            <subRoute2.Link>Subroute 2</subRoute2.Link>
          </li>
          <li>
            <subRoute3.Link id="2">Subroute 3</subRoute3.Link>
          </li>
        </ul>
        {props.children}
      </div>
    )
    const InnerLayout = (props: { children?: any }) => (
      <div>
        <h1>Layout</h1>
        {props.children}
      </div>
    )
    const history = createMemoryHistory()
    // (window as any).hist = history;
    const app = createApp({
      importBaseComponent: Layout,
      history,
      LoadingComponent: () => <h1>Loading</h1>,
      RouteNotFoundComponent: () => <div>NotFound</div>,
      initialState: {
        str: '',
        num: 15
      },
      initialReducers: {
        str: () => 'test',
        num: () => 12
      },
      render: jsx => {
        mount(jsx)
        return () => null
      }
    })
    // (window as any).app = app;
    // console.log("state", app.store.getState());

    const subRoute2 = app.createSubRoute(
      createRouteComposer<{}>('test'),
      {
        reducer: async () => ({})
      }
    )
    subRoute2.setComponent(
      async () => () => <InnerLayout />,
    )
    // is not any...
    const subRoute3 = subRoute2.createSubRoute(
      createRouteComposer<{ id: string }>('test/:id'),
      {
        reducer: async () => ({}),
      }
    )
    subRoute3.setComponent(async () => (props: any) => (
      <div>
        <h1>Waldows World</h1>
        {props.children}
      </div>
    ))
    app.init()
  })
})


