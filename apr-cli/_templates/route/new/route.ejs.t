---
to: <%=route%>/routes/<%=name%>/route.ts
---
import { createRouteComposer } from 'action-packed-react';
import { Parent } from '../../route';
export const route = createRouteComposer('<%=name%>')
const <%=name%>Route = (app: Parent) => {
  const <%=name%>Route = app.createSubRoute(
    route,
    () => import('./redux/ducks')
  )
  <%=name%>Route.setComponent(() => import('./layout'))
  <%=name%>Route.register()
  return <%=name%>Route;
}

export default <%=name%>Route
export type Parent = ReturnType<typeof <%=name%>Route>

