let isDevelop = false
try {
  isDevelop = process.env.NODE_ENV === 'development'
} catch (e) {
  // nothing to do here
}
interface IAction<T> {
  type: string
  payload: T
}

interface IHandler<T, IState> {
  (state: IState, action: IAction<T>): IState
}

interface IActionPack<T, IState> {
  (payload: T): { type: string; payload: T }
  _handler: IHandler<T, IState>
  _type: string
}

export const createActionPack = <IState, T>(
  type: string,
  handler: IHandler<T, IState>
) => {
  const ac: IActionPack<T, IState> & any = <T>(payload: T) => ({
    payload,
    type
  })
  ac._handler = handler
  ac._type = type
  return ac as IActionPack<T, IState>
}

export const createReducerFromActionPack = <T>(
  initialState: T,
  handlers: IActionPack<any, T>[],
  { enableWarnings = isDevelop }: { enableWarnings?: boolean } = {}
) => {
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
  return (state: T | undefined = initialState, action: IAction<any>) => {
    if (handlerMap[action.type]) {
      const updatedState = handlerMap[action.type]._handler(state, action)
      if (enableWarnings) {
        Object.keys(updatedState).forEach(k => {
          if (!expectedKeys[k]) {
            console.warn(
              'Unexpected state update for key which did not exist on the state before'
            )
          }
        })
      }
      return updatedState
    }
    return state
  }
}
