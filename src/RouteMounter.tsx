import * as React from 'react'
import { IRoutesMap } from './fe'
import { IRouteState } from './routeReducer'
import { routeMatchesPath } from './routeMatcher'
import { connect } from 'react-redux'

export class PathMatcher extends React.PureComponent<{
  routeMap: IRoutesMap
  route: IRouteState
}> {
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
      routePacks.map(routePack => routePack(connect))
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
