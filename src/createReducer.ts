import { Reducer, AnyAction } from 'redux'

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

export const createActionPack = <TState, T>(
  type: string,
  handler: IHandler<T, TState>
) => {
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
  {  }: {} = {}
): Reducer<T> => {
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
      const updatedState = handlerMap[action.type]._handler(
        state,
        action as IAction<any>
      )
      return updatedState
    }
    return state
  }
}
