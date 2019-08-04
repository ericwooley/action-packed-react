import { createActionPack, createReducerFromActionPack } from './createReducer'

describe('creating reducers', () => {
  describe('actionPack', () => {
    interface InitialState {
      test: string
    }
    const initialState: InitialState = {
      test: 'test'
    }
    it('should create an action pack', () => {
      const actionPack = createActionPack<InitialState, string>('updateTest', (state, action) => ({
        ...state,
        test: action.payload
      }))
      expect(actionPack('test2')).toEqual({
        type: 'updateTest',
        payload: 'test2'
      })
      expect(actionPack._handler(initialState, actionPack('test2'))).toEqual({
        test: 'test2'
      })
      expect(actionPack._type).toEqual('updateTest')
    })
    it('should work with error options', () => {
      const actionPack = createActionPack<InitialState, string>('updateTest', (state, action) => ({
        ...state,
        test: action.payload
      }))
      const error = new Error('Test error')
      expect(actionPack('test3', { error })).toEqual({
        type: 'updateTest',
        payload: 'test3',
        error
      })
    })
  })
  describe('reducers', () => {
    interface InitialState {
      test: string
    }
    const initialState: InitialState = {
      test: 'test'
    }
    const actionPack = createActionPack<InitialState, string>('updateTest', (state, action) => ({
      ...state,
      test: action.payload
    }))
    it('should create a reducer', () => {
      const reducer = createReducerFromActionPack(initialState, { actionPack })
      expect(reducer(initialState, actionPack('update'))).toEqual({
        test: 'update'
      })
    })
    describe('reducer', () => {
      const reducer = createReducerFromActionPack(initialState, { actionPack })
      it('should work with undefined and an unhandled action', () => {
        expect(reducer(undefined, { type: 'test', payload: 'test' })).toEqual(initialState)
      })
      it('should work with undefined and a handled action', () => {
        expect(reducer(undefined, actionPack('test2'))).toEqual({
          test: 'test2'
        })
      })
    })
  })
})
