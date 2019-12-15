---
to: <%=route%>/redux/sagas/<%= name %>.test.ts
---
import { <%= name %> } from './<%= name %>';

// There are a lot of strategies for testing sagas
// https://redux-saga.js.org/docs/advanced/Testing.html
describe('<%= name %>',() => {
  it('should exist', () => {
    expect(<%= name %>).toBeTruthy()
  })
})
