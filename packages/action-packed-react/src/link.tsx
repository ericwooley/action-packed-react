import * as React from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { BareBonesState } from './createApp'
import { IRouteComposer, IRouteLimitations } from './routeMatcher'

export interface IRouteProps {
  replace?: boolean
  currentPath?: string
  activeClass?: string
  dispatch?: any
}
export interface ILinkProps {
  redirect?: boolean
}
/** Creates a link component which uses history pushes onto the history object,
 * obeying the hash rules.
 * @param history history object, should match npm history package.
 * @param link IRouteComposer which has methods for manipulating a link.
 * @param useHashHistory If true, all links will prepend # before the link.
 */
export function createLink<T extends IRouteLimitations>(
  history: History,
  link: IRouteComposer<T>,
  useHashHistory: boolean
) {
  class APRLink extends React.PureComponent<
    Partial<React.HTMLProps<HTMLAnchorElement>> & Partial<IRouteProps> & T & ILinkProps
  > {
    componentDidMount() {
      if (this.props.redirect) {
        this.navigate()
      }
    }
    navigateFromEvent = (e: React.MouseEvent<HTMLAnchorElement>) => {
      this.navigate()
      if (this.props.onClick) this.props.onClick(e)
    }
    navigate = () => {
      const route = link.createUrl(this.props as any)
      if (this.props.replace) {
        history.replace(route)
      } else {
        history.push(route)
      }
    }
    render() {
      const { activeClass = '', currentPath, replace, dispatch, redirect, ...restProps } = this
        .props as any
      return (
        <a
          {...restProps}
          href={`${useHashHistory ? '#' : ''}${link.createUrl(this.props as any)}`}
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
    Partial<React.HTMLProps<HTMLAnchorElement>> & Partial<IRouteProps> & T & ILinkProps
  >
}
