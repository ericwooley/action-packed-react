---
to: <%=route%>/components/<%= name %>/<%= name %>.tsx
---
import * as React from 'react'

export interface <%= Name %>Props {
  children?: React.ReactChildren
}
export const <%= Name %> = (props: <%= Name %>Props) => {
  return (
    <div><%= Name %> { props.children }</div>
  )
}


