import { updateHistory, initialState } from './routeReducer'
describe('route reducer', () => {
  describe('updateHistory', () => {
    it(`should handle ${updateHistory._type}`, () => {
      const action = updateHistory({
        pathname: 'pathname',
        hash: 'hash',
        search: 'search',
        action: 'POP',
        state: 'state',
        key: 'key'
      })
      expect(updateHistory._handler(initialState, action)).toMatchSnapshot()
    })
    it(`should handle multiple ${updateHistory._type}`, () => {
      const action = updateHistory({
        pathname: 'pathname',
        hash: 'hash',
        search: 'search',
        action: 'POP',
        state: 'state',
        key: 'key'
      })
      let updatedState = updateHistory._handler(initialState, action)
      updatedState = updateHistory._handler(updatedState, action)
      updatedState = updateHistory._handler(updatedState, action)
      expect(updateHistory._handler(updatedState, action)).toMatchSnapshot()
    })
  })
})
