import * as React from 'react'
export const asMountableComponent = (LoadingComponent: React.ElementType, init: () => Promise<any>) => {
  return class ActionPacedReact extends React.Component {
    jsx: React.ReactElement = <LoadingComponent />
    constructor(props: any) {
      super(props)
      this.loadComponent().catch(e => {
        console.error('Error mounting root component', e)
      })
    }
    loadComponent = async () => {
      this.jsx = await init()
      this.forceUpdate()
    }
    render() {
      return this.jsx
    }
  }
}
