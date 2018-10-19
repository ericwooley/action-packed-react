import * as React from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { BareBonesState } from './action-packed-react'
import { IRouteComposer, IRouteLimitations } from './routeMatcher'

export interface IRouteProps {
  replace?: boolean
  currentPath?: string
  activeClass?: string
  dispatch?: any
}

export function createLink<T extends IRouteLimitations>(
  history: History,
  link: IRouteComposer<T>
) {
  class APRLink extends React.PureComponent<
    Partial<React.HTMLProps<HTMLAnchorElement>> & Partial<IRouteProps> & T
  > {
    navigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const route = link.createUrl(this.props as any)
      if (this.props.replace) {
        history.replace(route)
      } else {
        history.push(route)
      }
      if (this.props.onClick) this.props.onClick(e)
    }
    render() {
      const {
        activeClass = '',
        currentPath,
        replace,
        dispatch,
        ...restProps
      } = this.props as any
      return (
        <a
          {...restProps}
          href={link.createUrl(this.props as any)}
          onClick={this.navigate}
        >
          {this.props.children}
        </a>
      )
    }
  }
  return (connect((state: BareBonesState) => ({
    currentPath: state._route.currentLocation.pathname
    // typescript,  i really really hate you sometimes
  }))(APRLink as any) as any) as React.ComponentType<
    Partial<React.HTMLProps<HTMLAnchorElement>> & Partial<IRouteProps> & T
  >
}
