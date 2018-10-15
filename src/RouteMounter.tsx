import * as React from 'react'
import { BareBonesState } from './action-packed-react'
import { routeMatchesPath } from './routeMatcher'
import { Provider, connect } from 'react-redux'
import { Store } from 'redux'
import { AddMountAlert } from './mountAlert'
import { IRender, IRoutesMap, IRouteOptions } from './types'
interface IPathMatcherProps {
  routeMap: IRoutesMap
  pathname: string
  onRouteMatch: (routes: string[]) => any
  onPackLoaded: (routePack: IRouteOptions<any>[]) => any
  onMount: (route: string) => any
  onUnMount: (route: string, content: IRouteOptions<any>) => any
}
export class Loading extends React.PureComponent {
  render() {
    return <span>Loading...</span>
  }
}
const loading = <Loading key="loading" />
export class PathMatcher extends React.PureComponent<IPathMatcherProps> {
  routeMap: IRoutesMap
  constructor(props: any) {
    super(props)
    this.routeMap = this.props.routeMap
  }
  componentDidUpdate(lastProps: IPathMatcherProps) {
    if (lastProps.pathname !== this.props.pathname) {
      this.buildChildren()
    }
  }
  routeChildren: JSX.Element = <Loading key="loading" />
  buildChildren = async () => {
    const routes = Object.keys(this.routeMap)
    const route = this.props.pathname
    const matchingRoutes = routes
      .filter(routeMatchesPath(route))
      .sort((a, b) => {
        /* istanbul ignore next */
        if (a < b) return -1
        /* istanbul ignore next */
        if (a > b) return 1
        /* istanbul ignore next */
        return 0
      })
      .reverse()
    this.props.onRouteMatch(matchingRoutes)
    const routePacks = matchingRoutes.map(r => ({
      route: r,
      pack: this.routeMap[r]
    }))
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
    this.routeChildren =
      loadedPacks.reduce((children: JSX.Element | null, pack, index) => {
        const Component = AddMountAlert(
          pack.contents.component,
          pack.route,
          pack.contents
        )
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
      }, null) || loading
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

export const mount = (
  initialProps: IPathMatcherProps,
  store: Store,
  render: IRender, // typeof ReactDOM.render
  options: {
    onMount: () => any
  }
) => {
  const { onMount } = options
  const comp: React.ReactElement<any> = (
    <Provider store={store}>
      <ConnectedPathMatcher {...initialProps} ref={onMount} />
    </Provider>
  )
  return render(comp)
}
