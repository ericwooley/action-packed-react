---
to: <%=route%>/components/<%= name %>/<%= name %>.tsx
---
import * as React from 'react'

export interface <%= Name %>Props {
  children?: React.ReactNode
}
export const <%= h.changeCase.pascal(name) %> = (props: <%= Name %>Props) => {
  return (
    <div> <%= h.changeCase.pascal(name) %> { props.children }</div>
  )
}


