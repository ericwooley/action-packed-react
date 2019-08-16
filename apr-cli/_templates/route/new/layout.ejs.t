---
to: <%=route%>/routes/<%=name%>/layout.tsx
---
import * as React from 'react'

interface <%= Name %>Props {
  children?: React.ReactChildren
}

const <%= name %>Layout = (props: <%= Name %>Props) => (
  <div>
    <h1><%= name %></h1>
    { props.children }
  </div>
)
export default <%= name %>Layout;
