---
to: src/ui/<%= name %>/<%= name %>.tsx
---
import * as React from 'react'

export interface <%= Name %>Props {
  children?: React.ReactChildren
}
export const <%= h.changeCase.pascal(name) %> = (props: <%= Name %>Props) => {
  return (
    <div> <%= h.changeCase.pascal(name) %> { props.children } </div>
  )
}


