import * as React from 'react'
import { IRoutesMap, BareBonesState } from './fe'
import { routeMatchesPath } from './routeMatcher'
import { Provider, connect } from 'react-redux'
import { Store } from 'redux'
interface IPathMatcherProps {
  routeMap: IRoutesMap
  pathname: string
}
export class PathMatcher extends React.PureComponent<IPathMatcherProps> {
  routeChildren: JSX.Element = <Loading key="loading" />
  buildChildren = async () => {
    const routes = Object.keys(this.props.routeMap)
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
    const routePacks = matchingRoutes.map(r => this.props.routeMap[r])
    // preload pack
    const loadedPacks = await Promise.all(
      routePacks.map(routePack => routePack())
    )
    this.routeChildren = loadedPacks.reduce(
      (children: JSX.Element | null, pack, index) => {
        const Component = pack.component
        if (children) {
          return <Component key={matchingRoutes[index]}>{children}</Component>
        }
        return <Component key={matchingRoutes[index]} />
      },
      null
    ) || <Loading key="loading" />
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

class RouteListener extends React.Component<{
  store: Store
  routeMap: IRoutesMap
}> {
  routeMap: IRoutesMap

  constructor(props: any, state: any) {
    super(props, state)
    this.routeMap = this.props.routeMap
  }
  updateRouteMap = (routeMap: IRoutesMap) => {
    this.routeMap = routeMap
    this.forceUpdate()
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedPathMatcher routeMap={this.routeMap} />
      </Provider>
    )
  }
}
export const mount = (
  initialProps: { routeMap: IRoutesMap },
  store: Store,
  render: IRender, // typeof ReactDOM.render
  options: {
    el?: HTMLElement
    onMount?: (jsxEl: RouteListener) => any
  } = {}
) => {
  let routeMap = initialProps.routeMap
  const { onMount = (c?: RouteListener) => null, el } = options
  const comp: React.ReactElement<any> = (
    <RouteListener
      store={store}
      routeMap={routeMap}
      ref={rl => {
        if (rl) {
          onMount(rl)
        }
      }}
    />
  )
  render(comp)
  return {
    updateRouteMap: (newRouteMap: IRoutesMap) => {
      routeMap = newRouteMap
    }
  }
}
