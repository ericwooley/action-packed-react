import * as React from 'react'
import { createApp } from './'
import { createMemoryHistory } from 'history'
import { mount } from 'enzyme'
import { createRouteComposer } from './routeMatcher'
import { createStore } from './createApp'

describe('basic test', () => {
  it('should be usable', async () => {
    const Layout = (props: { children?: React.ReactNode }) => (
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
    const storeBundle = createStore({
      initialState: {
        str: '',
        num: 15
      },
      initialReducers: {
        str: () => 'test',
        num: () => 12
      }
    })
    const app = createApp({
      ...storeBundle,
      layout: Layout,
      history,
      LoadingComponent: () => <h1>Loading</h1>,
      RouteNotFoundComponent: () => <div>NotFound</div>
    })
    mount(<app.AppComponent />)
    const subRoute2 = app.createSubRoute(createRouteComposer<{}>('test'), async () => ({
      test: () => null
    }))
    subRoute2.setComponent(async () => () => <InnerLayout />)
    // is not any...
    const subRoute3 = subRoute2.createSubRoute(
      createRouteComposer<{ id: string }>('test/:id'),
      async () => ({ bob: () => null })
    )
    subRoute3.setComponent(async () => (props: any) => (
      <div>
        <h1>Waldows World</h1>
        {props.children}
      </div>
    ))
    await app.init()
  })
})
