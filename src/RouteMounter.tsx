import * as React from 'react'
import { IRoutesMap } from './fe'
import { IRouteState } from './routeReducer'
import { routeMatchesPath } from './routeMatcher'
import { connect, Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { Store } from 'redux'
interface IPathMatcherProps {
  routeMap: IRoutesMap
  route: IRouteState
}
export class PathMatcher extends React.PureComponent<IPathMatcherProps> {
  routeChildren: JSX.Element = <Loading key="loading" />
  buildChildren = async () => {
    const routes = Object.keys(this.props.routeMap)
    const route = this.props.route.pathname
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
      routePacks.map(routePack => routePack(connect as any))
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

export class Loading extends React.PureComponent {
  render() {
    return <span>Loading...</span>
  }
}

export const mount = (
  el: HTMLElement,
  initialProps: IPathMatcherProps,
  store: Store
) => {
  let routeMap = initialProps.routeMap
  let route = initialProps.route
  class RouteListener extends React.Component<any> {
    render() {
      return (
        <Provider store={store}>
          <PathMatcher routeMap={routeMap} route={route} />
        </Provider>
      )
    }
  }
  let listener: RouteListener | null = null
  ReactDOM.render(
    <RouteListener
      ref={rl => {
        listener = rl
      }}
    />,
    el
  )
  return {
    updateRouteMap: (rm: IRoutesMap) => {
      routeMap = rm
      if (listener) listener.forceUpdate()
    }
  }
}
