import * as React from 'react'
export const asMountableComponent = (
  LoadingComponent: React.ElementType,
  init: () => Promise<any>
) => {
  return class ActionPackedReact extends React.Component {
    jsx: React.ReactElement = (<LoadingComponent />)
    constructor(props: any) {
      super(props)
      this.loadComponent().catch(e => {
        console.error('Error mounting root component', e)
      })
    }
    mounted = false
    componentDidMount() {
      this.mounted = true
    }
    componentWillUnmount() {
      this.mounted = false
    }
    loadComponent = async () => {
      this.jsx = await init()
      if (this.mounted) this.forceUpdate()
    }
    render() {
      return this.jsx
    }
  }
}
