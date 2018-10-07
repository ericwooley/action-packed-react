import * as React from 'react'
import { IRoutesMap } from './fe'
import { IRouteState } from './routeReducer'

export class PathMatcher extends React.PureComponent<{
  routeMap: IRoutesMap
  route: IRouteState
}> {
  buildChldren = async () => {
    // these need to be sorted by length so that shorter routes match first.
  }
  render() {
    let key = 'loading'
    const Content = Loading
    return (
      <>
        <Content />
      </>
    )
  }
}

export class Loading extends React.PureComponent {
  render() {
    return <span>Loading...</span>
  }
}
