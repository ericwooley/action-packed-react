import React from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { BareBonesState } from './action-packed-react'
export const createLink = (history: History, link: string) => {
  return connect((state: BareBonesState) => ({
    currentPath: state._route.currentLocation.pathname
  }))(
    class APRLink extends React.PureComponent<
      React.HTMLProps<HTMLAnchorElement> & {
        replace?: boolean
        currentPath: string
        activeClass?: string
      }
    > {
      navigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        if (this.props.replace) {
          history.replace(link)
        } else {
          history.push(link)
        }
        if (this.props.onClick) this.props.onClick(e)
      }
      render() {
        const { activeClass = '', replace, ...restProps } = this.props
        return (
          <a {...restProps} href={link} onClick={this.navigate}>
            {this.props.children}
          </a>
        )
      }
    }
  )
}
