---
to: <%=route%>/routes/<%=name%>/route.ts
---
import { createRouteComposer, IRouteComponentProps, combineRoutes } from 'action-packed-react';
import {
  Parent as RouteParent,
  route as parentRoute,
  RouteParams as ParentRouteParams
} from '../../route';

export type RouteParams = ParentRouteParams & {};
export const route = combineRoutes(parentRoute, createRouteComposer<RouteParams>('<%=name%>'))
export type RouteProps = IRouteComponentProps<RouteParams>
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

