import { Component } from 'react'
import { createStore, combineReducers } from 'redux'
import { History } from 'history'
interface IHaveType {
  type: string
}

interface IReducerBundle<SubState> {
  initialState: SubState
  reducer: (action: IHaveType, state: SubState) => SubState
  handlers: { [k: string]: (action: IHaveType, state: SubState) => SubState }
}

interface IOptions<T, Keys extends keyof T> {
  initialReducers: { [k in Keys]: IReducerBundle<any>[] }
  history: History
  rootEl: HTMLDivElement
}

export function init<T, Keys extends keyof T>({
  initialReducers,
  history
}: IOptions<T, Keys>) {
  const store = createStore(
    combineReducers({
      _history: () => ({})
    })
  )
  const unlisten = history.listen((location, action) => {})
  return {}
}

class TheWooleyRoute extends Component<{ history: History }> {}
