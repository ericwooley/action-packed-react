---
to: <%=route%>/routes/<%=name%>/index.ts
---
import { app } from 'app'
import { createRouteComposer } from 'action-packed-react/routeMatcher';

export const route = createRouteComposer('<%=name%>')
const <%= h.changeCase.camel(name) %>Route = app.createSubRoute(
  route,
  () => import('./redux/ducks')
)
<%= h.changeCase.camel(name) %>Route.setComponent(() => import('./layout'))
<%= h.changeCase.camel(name) %>Route.register()
export default <%= h.changeCase.camel(name) %>Route;
