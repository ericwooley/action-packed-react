import * as React from 'react'
import { BareBonesState } from './action-packed-react'
import { Provider, connect } from 'react-redux'
import { Store } from 'redux'
import { IRender, IRoutesMap } from './types'
import { selectors } from './routeReducer'
interface IPathMatcherProps {
  routeMap: IRoutesMap
  pathname: string
  matchingRoutes: string[]
  component: React.ComponentType<any>
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
    const matchingRoutes = this.props.matchingRoutes
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
    this.routeChildren =
      loadedPacks.reduce((children: JSX.Element | null, pack, index) => {
        const Component = pack.contents.component
        return <Component key={matchingRoutes[index]}>{children}</Component>
      }, null) || loading
    this.forceUpdate()
  }
  render() {
    const content = this.routeChildren
    const RootComponent = this.props.component
    return <RootComponent>{content}</RootComponent>
  }
}

const ConnectedPathMatcher = connect(
  (state: BareBonesState) => ({
    pathname: selectors.currentPath(state),
    matchingRoutes: selectors.matchingRoutes(state)
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
