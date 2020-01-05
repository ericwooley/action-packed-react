import * as React from 'react'
import { createApp } from './'
import { createMemoryHistory } from 'history'
import { mount } from 'enzyme'
import { createRouteComposer } from './routeMatcher'
import { createStore } from './createApp'
import { createLink } from './link'

describe('basic test', () => {
  it('should be usable', async () => {
    const Layout = (props: { children?: React.ReactNode }) => (
      <div>
        <h1>Layout</h1>
        <ul>
          <li>
            <SubRoute2Link>Subroute 2</SubRoute2Link>
          </li>
          <li>
            <SubRoute3Link id="2">Subroute 3</SubRoute3Link>
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
    const subRoute2RouteComposer = createRouteComposer<{}>('test')
    const SubRoute2Link = createLink(subRoute2RouteComposer)
    const subRoute2 = app.createSubRoute(createRouteComposer<{}>('test'), async () => ({
      test: () => null
    }))
    subRoute2.setComponent(async () => () => <InnerLayout />)
    const subRoute3RouteComposer = createRouteComposer<{ id: string }>('test/:id')
    const SubRoute3Link = createLink(subRoute3RouteComposer)
    // is not any...
    const subRoute3 = subRoute2.createSubRoute(subRoute3RouteComposer, async () => ({
      bob: () => null
    }))
    subRoute3.setComponent(async () => (props: any) => (
      <div>
        <h1>Waldows World</h1>
        {props.children}
      </div>
    ))
    await app.init()
  })
})
