import * as React from 'react'
import { IRoutesMap, BareBonesState, EVENTS, IRouteOptions, IRoutesMapValue } from './createApp'
import { routeMatchesPath } from './routeMatcher'
import { Provider, connect } from 'react-redux'
import { Store } from 'redux'
import { AddMountAlert } from './mountAlert'
interface IPathMatcherProps {
  routeMap: IRoutesMap
  pathname: string
  emitter: Telegraph.Emitter<EVENTS>
  onRouteMatch: (routes: string[]) => any
  onPackLoaded: (routePack: IRouteOptions<any>[]) => any
  onMount: (route: string) => any
  onUnMount: (route: string) => any
}
export class PathMatcher extends React.PureComponent<IPathMatcherProps> {
  routeMap: IRoutesMap
  constructor(props: any) {
    super(props)
    this.routeMap = this.props.routeMap
    this.props.emitter.on(EVENTS.ROUTE_MAP_UPDATE, this.updateRoutesMap)
  }
  componentDidUpdate(lastProps: IPathMatcherProps) {
    if (lastProps.pathname !== this.props.pathname) {
      this.buildChildren()
    }
  }
  updateRoutesMap(routesMap: IRoutesMap) {
    this.routeMap = routesMap
  }
  componentWillUnmount() {
    this.props.emitter.off(EVENTS.ROUTE_MAP_UPDATE, this.updateRoutesMap)
  }
  routeChildren: JSX.Element = <Loading key="loading" />
  buildChildren = async () => {
    const routes = Object.keys(this.routeMap)
    const route = this.props.pathname
    const matchingRoutes = routes
      .filter(routeMatchesPath(route))
      .sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })
      // reverse to get the most inner children first
      .reverse()
    this.props.onRouteMatch(matchingRoutes)
    const routePacks = matchingRoutes.map(r => ({
      route: r,
      pack: this.routeMap[r]
    }))
    // preload pack
    const loadedPacks = await Promise.all(
      routePacks.map(async routePack => {
        const ret = {
          route: routePack.route,
          pack: routePack.pack,
          contents: await routePack.pack.loader()
        }
        return ret
      })
    )
    this.props.onPackLoaded(loadedPacks.map(p => p.contents))
    this.routeChildren = loadedPacks.reduce((children: JSX.Element | null, pack, index) => {
      const Component = AddMountAlert(pack.contents.component, pack.route)
      if (children) {
        return (
          <Component
            key={matchingRoutes[index]}
            onMount={this.props.onMount}
            onUnMount={this.props.onUnMount}
          >
            {children}
          </Component>
        )
      }
      return (
        <Component
          key={matchingRoutes[index]}
          onMount={this.props.onMount}
          onUnMount={this.props.onUnMount}
        />
      )
    }, null) || <Loading key="loading" />
    this.forceUpdate()
  }
  render() {
    const content = this.routeChildren
    return <>{content}</>
  }
}

const ConnectedPathMatcher = connect(
  (state: BareBonesState) => ({
    pathname: state._route.pathname
  }),
  {}
)(PathMatcher)

export class Loading extends React.PureComponent {
  render() {
    return <span>Loading...</span>
  }
}

// Should return a function that unmounts
export interface IRender {
  (c: React.ReactElement<any>): () => any
}

export const mount = (
  initialProps: IPathMatcherProps,
  store: Store,
  render: IRender, // typeof ReactDOM.render
  options: {
    onMount?: () => any
  }
) => {
  const { onMount = () => null } = options
  const comp: React.ReactElement<any> = (
    <Provider store={store}>
      <ConnectedPathMatcher
        {...initialProps}
        ref={el => {
          if (el) onMount()
        }}
      />
    </Provider>
  )
  return render(comp)
}
