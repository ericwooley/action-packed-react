---
to: <%=route%>/routes/<%=name%>/index.ts
---

import { app } from '/'
import { createRouteComposer } from 'action-packed-react/routeMatcher';

export const route = createRouteComposer(<%=name%>)
const <%= h.changeCase.camel(name) %>Route = app.createSubRoute(
  route,
  () => import('./redux/ducks')
)
export default <%= h.changeCase.camel(name) %>Route;
