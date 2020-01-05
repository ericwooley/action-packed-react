---
to: <%=route%>/redux/ducks/<%= name %>/<%= name %>.test.ts
---
import { initialState, <%= name %> } from "./<%= name %>";

describe("<%= name %>", () => {
  it("should reset", () => {
    expect(<%= name %>(initialState, <%= name %>.actionCreators.reset()));
  });
});
