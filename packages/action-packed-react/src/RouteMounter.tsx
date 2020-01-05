import * as React from 'react'
import { BareBonesState } from './createApp'
import { Provider, connect } from 'react-redux'
import { Store } from 'redux'
import { IRoutesMap } from './types'
import { selectors } from './routeReducer'
import { getVariablesForRoute, routeMatchesPathExactly } from './routeMatcher'
import { History, createMemoryHistory } from 'history'

export const HistoryContext = React.createContext<{ useHashHistory: boolean; history: History }>({
  useHashHistory: true,
  history: createMemoryHistory()
})
export interface IPathMatcherProps {
  routeMap: IRoutesMap
  history: History
  pathname: string
  activeRoute: string
  matchingRoutes: string[]
  RouteNotFoundComponent: React.ComponentType<Partial<IPathMatcherProps>>
  LoadingComponent: React.ComponentType<Partial<IPathMatcherProps>>
  component: React.ComponentType<any>
  useHashHistory: boolean
}
const emptyObject = {}
export class PathMatcher extends React.Component<IPathMatcherProps> {
  routeMap: IRoutesMap
  constructor(props: any) {
    super(props)
    this.routeMap = this.props.routeMap
    this.buildChildren(false).catch(e => console.error('Error building children', e))
  }
  componentDidUpdate(lastProps: IPathMatcherProps) {
    if (lastProps.activeRoute !== this.props.activeRoute || !this.routeChildren) {
      this.buildChildren().catch(e => console.error('Error building children', e))
    }
  }
  unmounting = false
  routeChildren: JSX.Element | undefined
  buildChildren = async (forceUpdate = !this.unmounting) => {
    const { RouteNotFoundComponent, LoadingComponent } = this.props
    const matchingRoutes = this.props.matchingRoutes
    const routePacks = matchingRoutes.map(r => ({
      route: r,
      pack: this.routeMap[r]
    }))
    this.routeChildren = <LoadingComponent key="loading" />
    if (forceUpdate) this.forceUpdate()
    const loadedPacks = await Promise.all(
      routePacks.map(async routePack => {
        const ret = {
          path: routePack.route,
          pack: routePack.pack,
          contents: await routePack.pack.loader()
        }
        return ret
      })
    )
    this.routeChildren = loadedPacks.reduce((children: JSX.Element | null, pack, index) => {
      const Component = pack.contents.component
      return (
        <Component
          key={matchingRoutes[index]}
          exactUrlMatch={routeMatchesPathExactly(pack.path, this.props.activeRoute)}
          history={this.props.history}
          params={getVariablesForRoute(pack.path, this.props.activeRoute)}
        >
          {children}
        </Component>
      )
    }, null) || <RouteNotFoundComponent {...this.props} />
    if (forceUpdate) this.forceUpdate()
  }
  componentWillUnmount() {
    this.unmounting = true
  }
  render() {
    const content = this.routeChildren
    const RootComponent = this.props.component
    return (
      <HistoryContext.Provider
        value={{
          history: this.props.history,
          useHashHistory: this.props.useHashHistory
        }}
      >
        <RootComponent
          key="app-root"
          history={this.props.history}
          exactUrlMatch={routeMatchesPathExactly('/', this.props.activeRoute)}
          params={emptyObject}
        >
          {content}
        </RootComponent>
      </HistoryContext.Provider>
    )
  }
}

const ConnectedPathMatcher = connect(
  (state: BareBonesState) => ({
    activeRoute: selectors.activePath(state),
    pathname: selectors.currentPath(state),
    matchingRoutes: selectors.activePathMatchingRoutes(state)
  }),
  {}
)(PathMatcher)

export const mount = (initialProps: IPathMatcherProps, store: Store) => {
  const comp: React.ReactElement<any> = (
    <Provider store={store}>
      <ConnectedPathMatcher {...initialProps} />
    </Provider>
  )
  return comp
}
