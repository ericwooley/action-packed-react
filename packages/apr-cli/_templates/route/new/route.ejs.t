---
to: <%=route%>/routes/<%=name%>/route.ts
---
import { createRouteComposer, IRouteComponentProps } from 'action-packed-react';
import { Parent as RouteParent } from '../../route';
type Params = {}
export const route = createRouteComposer<Params>('<%=name%>')
export type RouteProps = IRouteComponentProps<Params>
const <%=name%>Route = (app: RouteParent) => {
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

