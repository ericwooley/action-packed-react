---
to: <%=route%>/redux/ducks/<%= name %>/index.ts
---
import { <%= h.changeCase.pascal(name) %> } from './<%= name %>'

export default <%= h.changeCase.pascal(name) %>


