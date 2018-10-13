import * as React from 'react'
import { IRoutesMap, BareBonesState, EVENTS } from './createApp'
import { routeMatchesPath } from './routeMatcher'
import { Provider, connect } from 'react-redux'
import { Store } from 'redux'
import { Emitter } from 'telegraph-events'
interface IPathMatcherProps {
  routeMap: IRoutesMap
  pathname: string
  emitter: Emitter<EVENTS>
}
export class PathMatcher extends React.PureComponent<IPathMatcherProps> {
  routeMap: IRoutesMap
  constructor(props: any) {
    super(props)
    this.routeMap = this.props.routeMap
    this.props.emitter.on(EVENTS.ROUTE_MAP_UPDATE, this.updateRoutesMap)
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
    const routePacks = matchingRoutes.map(r => this.routeMap[r])
    // preload pack
    const loadedPacks = await Promise.all(routePacks.map(routePack => routePack()))
    this.routeChildren = loadedPacks.reduce((children: JSX.Element | null, pack, index) => {
      const Component = pack.component
      if (children) {
        return <Component key={matchingRoutes[index]}>{children}</Component>
      }
      return <Component key={matchingRoutes[index]} />
    }, null) || <Loading key="loading" />
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

export interface IRender {
  (c: React.ReactElement<any>): any
}

export const mount = (
  initialProps: { routeMap: IRoutesMap },
  store: Store,
  render: IRender, // typeof ReactDOM.render
  options: {
    onMount?: () => any
    emitter: Emitter<EVENTS>
  }
) => {
  let routeMap = initialProps.routeMap
  const { onMount = () => null, emitter } = options
  const comp: React.ReactElement<any> = (
    <Provider store={store}>
      <ConnectedPathMatcher
        ref={el => {
          if (el) onMount()
        }}
        emitter={emitter}
        routeMap={routeMap}
      />
    </Provider>
  )
  render(comp)
  return {
    updateRouteMap: (newRouteMap: IRoutesMap) => {
      routeMap = newRouteMap
    }
  }
}
