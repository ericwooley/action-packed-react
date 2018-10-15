import * as React from 'react'
export const AddMountAlert = <IProps, T>(
  c: React.ComponentType<IProps>,
  identifier: string,
  extra?: T
) => {
  return class RouteAlerter extends React.Component<
    IProps & {
      onMount: (id: typeof identifier, extra?: T) => any
      onUnMount: (id: typeof identifier, extra?: T) => any
    }
  > {
    componentDidMount() {
      this.props.onMount(identifier, extra)
    }
    componentWillUnmount() {
      this.props.onUnMount(identifier, extra)
    }
    render() {
      const { onMount, ...restProps } = this.props as any
      return React.createElement(c, restProps)
    }
  }
}
