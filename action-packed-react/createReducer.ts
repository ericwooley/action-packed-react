import { Reducer, AnyAction } from 'redux'

/**
 * A standard action which only has a type and payload.
 */
export interface IAction<T, E = Error | object, M = {}> extends AnyAction {
  type: string
  payload: T
  meta?: M
  error?: E
}

/**
 * Function which takes a state, and returns a modified version based on the
 * action, should not modify state, but return a copy
 */
export interface IHandler<T, IState> {
  (state: IState, action: IAction<T>): IState
}

export interface IFSAOptions<M extends object = {}> {
  error?: Error | object
  meta?: M
}
/**
 * Function which accepts a payload, and creates a @IAction from it.
 * Has attached _handler and _type for convenience
 */
export interface IActionPack<T, IState, M extends object = {}> {
  (payload: T, options?: IFSAOptions<M>): IAction<T>
  _handler: IHandler<T, IState>
  _type: string
}

/**
 * Create action pack creates an a action creator which accepts a payload and
 * returns a flux standard action and the action creator has a ._type, for
 * easily checking the type that would be returned, as well as a _handler,
 * which can be used to reduce a state of the expected type.
 * @param type string to be used as the action type.
 * @param handler handler, which should take a state, and standard action,
 *   then return a modified state
 * @see createReducerFromActionPack for combining actionPacks into a single
 *   reducer
 * @example
 * const firstTodo {title: 'Some thing i need to do', done: false}
 * type Todo = typeof firstTodo;
 * const initialTodoState = [firstTodo];
 * type TodoState = typeof initialTodoState;
 * const addTodo = createActionPack<TodoState, Todo>(
 *  'ADD_TODO',
 *  (state, action) => [...state, action.payload]
 *  );
 * // addTodo._type // ADD_TODO
 * const addTodoDemoAction = addTodo({title: 'Something else I need to do', done: true})
 * // {type: 'ADD_TODO', payload: {title: 'Something else I need to do', done: true} }
 * addTodo._handler(initialState, addTodoDemoAction)
 * // [
 * //   {title: 'Some thing i need to do', done: false},
 * //   {title: 'Something else I need to do', done: true}
 * // ]
 */
export const createActionPack = <TState, T, M extends object = {}>(
  type: string,
  handler: IHandler<T, TState>,
  defaultMeta?: M
) => {
  const ac: IActionPack<T, TState, M> & any = (
    payload: T,
    { error, meta }: IFSAOptions<M> = {}
  ) => {
    const action = {
      payload,
      type,
      meta: defaultMeta || meta ? { ...defaultMeta, meta } : undefined,
      error
    }
    if (!action.meta) {
      delete action.meta
    }
    if (!action.error) {
      delete action.error
    }
    return action
  }
  ac._handler = handler
  ac._type = type
  return ac as IActionPack<T, TState, M>
}

/**
 * Create a reducer with actionCreators as a property, which uses the
 * actionPack handlers to reduce state.
 * @param initialState The initial state to be used by the reducer
 * @param actionPacks Object of action packs whose handlers will be used to
 *   to reduce the the state when the action packs type is dispatched
 * @example
 * const firstTodo {title: 'Some thing i need to do', done: false}
 * type Todo = typeof firstTodo;
 * const initialTodoState = [];
 * const reducer = createReducerFromActionPack(initialTodoState, {
 *   addTodo: createActionPack<TodoState, Todo>(
 *     'ADD_TODO',
 *     (state, action) => [...state, action.payload]
 *   ),
 *   removeTodo: createActionPack<TodoState, Todo>(
 *     'REMOVE_TODO',
 *     (state, action) => state.filter(todo => todo !== action.payload)
 *   ),
 * });
 * let withFirstTodo = reducer(initialState, reducer.actionCreators.addTodo(firstTodo))
 * // [{title: 'Some thing i need to do', done: false}]
 * let withoutFirstTodo = reducer(withFirstTodo, reducer.actionCreators.removeTodo(firstTodo))
 * // []
 *
 */
export const createReducerFromActionPack = <T>(
  initialState: T,
  actionPacks: { [key: string]: IActionPack<any, T, any> }
): Reducer<T> & { actionCreators: typeof actionPacks } => {
  const handlerMap = Object.values(actionPacks).reduce(
    (hmap, handler) => {
      hmap[handler._type] = handler
      return hmap
    },
    {} as {
      [key: string]: IActionPack<T, any, any>
    }
  )
  const reducer = (state: T | undefined = initialState, action: AnyAction) => {
    if (handlerMap[action.type]) {
      const updatedState = handlerMap[action.type]._handler(state, action as IAction<any>)
      return updatedState
    }
    return state
  }
  reducer.actionCreators = actionPacks
  return reducer
}
