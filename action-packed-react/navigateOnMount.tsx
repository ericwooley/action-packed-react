import * as React from 'react'
import { History } from 'history'
import { IRouteComposer } from './routeMatcher'
export function navigateOnMount<T>(
  RootApp: React.ElementType,
  {
    history,
    routeComposer,
    routeProps,
    renderFullApp = false
  }: { history: History; routeComposer: IRouteComposer<T>; routeProps: T; renderFullApp?: boolean }
) {
  return class ActionPacedReact extends React.Component {
    componentDidMount() {
      history.push(routeComposer.createUrl(routeProps))
    }

    render() {
      return renderFullApp ? <RootApp /> : null
    }
  }
}
