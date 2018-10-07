import {
  routeMatchesPath,
  getVariablesForRoute,
  routeMatcher
} from './routeMatcher'

describe('routeMatcher', () => {
  describe('routeMatchesPath', () => {
    it('should match a plain path', () => {
      expect(routeMatchesPath('/home/test')('/home/test')).toBeTruthy()
    })
    it('should match a plain with extra slashes', () => {
      expect(routeMatchesPath('/home/test///')('/home/test')).toBeTruthy()
    })
    it('should match a path with variables', () => {
      expect(routeMatchesPath('/home/test')('/home/:test')).toBeTruthy()
    })
    it('should not match a path that is too long', () => {
      expect(routeMatchesPath('/home/test')('/home/test/12')).toBeFalsy()
    })
    it('should not match a path that is too short', () => {
      expect(routeMatchesPath('/home/test')('/home')).toBeFalsy()
    })
  })
  describe('getVariablesForRoute', () => {
    it('should return the variables', () => {
      const expected = {
        id: '12'
      }
      expect(getVariablesForRoute('/home/:id', '/home/12')).toEqual(expected)
    })
    it('should return the variables for multiple', () => {
      const expected = {
        id: '12',
        friendId: '37'
      }
      expect(
        getVariablesForRoute('/home/:id/:friendId', '/home/12/37')
      ).toEqual(expected)
    })
    it('should return the variables for multiple', () => {
      const expected = {
        id: '12',
        friendId: '37'
      }
      expect(
        getVariablesForRoute('/home/:id/:friendId', '/home/12/37')
      ).toEqual(expected)
    })
    it('should return the variables for none', () => {
      const expected = {}
      expect(getVariablesForRoute('/home', '/home')).toEqual(expected)
    })
    it('should throw an error on segment size mismatch', () => {
      expect(() => getVariablesForRoute('/home', '/home/:id')).toThrow()
    })
  })
  describe('routeMatchesPath', () => {
    it('should find all paths that match', () => {
      const routeMap = {
        '/test/123': '',
        '/test/:id': '',
        '/test/home': '',
        '/home/123': ''
      }
      const matches = routeMatcher(routeMap, { pathname: '/test/123' })
      expect(matches).toEqual(['/test/123', '/test/:id'])
    })
  })
})
