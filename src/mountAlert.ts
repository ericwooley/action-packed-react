import * as React from 'react'
export const AddMountAlert = <IProps>(c: React.ComponentType<IProps>, identifier: string) => {
  return class RouteAlerter extends React.Component<
    IProps & {
      onMount?: (id: typeof identifier) => any
      onUnMount?: (id: typeof identifier) => any
    }
  > {
    componentWillMount() {
      if (this.props.onMount) this.props.onMount(identifier)
    }
    componentWillUnmount() {
      if (this.props.onUnMount) this.props.onUnMount(identifier)
    }
    render() {
      const { onMount, ...restProps } = this.props as any
      return React.createElement(c, restProps)
    }
  }
}
