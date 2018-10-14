import { Reducer, AnyAction } from 'redux'

let isDevelop = false
try {
  isDevelop = process.env.NODE_ENV === 'development'
} catch (e) {
  // nothing to do here
}
export interface IAction<T> extends AnyAction {
  type: string
  payload: T
}

export interface IHandler<T, IState> {
  (state: IState, action: IAction<T>): IState
}

export interface IActionPack<T, IState> {
  (payload: T): IAction<T>
  _handler: IHandler<T, IState>
  _type: string
}

export const createActionPack = <TState, T>(type: string, handler: IHandler<T, TState>) => {
  const ac: IActionPack<T, TState> & any = (payload: T) => ({
    payload,
    type
  })
  ac._handler = handler
  ac._type = type
  return ac as IActionPack<T, TState>
}

export const createReducerFromActionPack = <T>(
  initialState: T,
  handlers: IActionPack<any, T>[],
  { enableWarnings = isDevelop }: { enableWarnings?: boolean } = {}
): Reducer<T> => {
  let expectedKeys: { [key: string]: boolean } = {}
  if (enableWarnings) {
    expectedKeys = Object.keys(initialState).reduce(
      (dict, k) => {
        dict[k] = true
        return dict
      },
      {} as { [key: string]: boolean }
    )
  }
  const handlerMap = handlers.reduce(
    (hmap, handler) => {
      hmap[handler._type] = handler
      return hmap
    },
    {} as {
      [key: string]: IActionPack<T, any>
    }
  )
  return (state: T | undefined = initialState, action: AnyAction) => {
    if (handlerMap[action.type]) {
      const updatedState = handlerMap[action.type]._handler(state, action as IAction<any>)
      if (enableWarnings) {
        Object.keys(updatedState).forEach(k => {
          if (!expectedKeys[k]) {
            console.warn('Unexpected state update for key which did not exist on the state before')
          }
        })
      }
      return updatedState
    }
    return state
  }
}
