---
to: <%=route%>/routes/<%=name%>/redux/selectors/<%=name%>.ts
---
import { createSelector } from 'reselect'
import route from '../../'

const identity = createSelector(route.baseSelector, (routeState) => routeState);

export default {
  identity
}
