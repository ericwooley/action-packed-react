import { welcomeRoute } from './index'
import { createActionPack, createReducerFromActionPack } from 'action-packed-react/createReducer'
import { createSelector } from 'reselect';

// setup data
/* tslint:disable:max-line-length */
const mscott = { id: '0', name: 'Michael Scott', quote: `Here's the thing. When a company screws up, best thing to do is call a press conference. Alert the media and then you control the story. Wait for them to find out, and the story controls you. That's what happened to O.J.` }
export const userList = [
  mscott,
  { id: '1', name: 'Dwight Schrute', quote: `I come from a long line of fighters, my maternal grandfather was the toughest guy I ever knew. World War II veteran. He killed twenty men and then spent the rest of the war in an Allied prison camp... My father battled blood pressure and obesity all his life... different kind of fight.` },
  { id: '2', name: 'Jim Halpert', quote: `He has not stopped working... for a second. At 12:45, he sneezed, while keeping his eyes open, which I always thought was impossible. At 1:32 he peed. And I know that because he did that in an open soda bottle, under the desk, while filling out expense reports. And on the flip side, I've been so busy watching him that I haven't even started work. It's exhausting, being this vigilant. I'll probably have to go home early today.` },
  { id: '3', name: 'Andy Bernard', quote: `Big Tuna is a super ambitious guy, you know? Cut your throat to get ahead kind of guy, but I mean I'm not threatened by him. I went to Cornell, you ever heard of it. I graduated in four years. I never studied once. I was drunk the whole time, and I sang in the acappella group, 'Here Comes Treble.'` },
  { id: '4', name: 'Creed Braton', quote: `A lot of jazz cats are blind. But, they can play the piano like nobody's business. I'd like to put the piano in front of Pam, without her glasses and see what happens. I'd also like to see her topless.` },
]
/* tslint:enable:max-line-length */

export type User = typeof mscott
export const usersById = userList.reduce((acc, user) => {
  acc[user.id] = user
  return acc
}, {} as { [key: string]: User })

// actual reducer state.
const initialState = usersById;
type IUserListState = typeof initialState
export default createReducerFromActionPack(initialState, {
  deleteUser: createActionPack<IUserListState, string>('DELETE_USER', (state, action) => {
    const copyState = { ...state }
    delete copyState[action.payload]
    return copyState
  })
})

export const selectors = {
  userList: createSelector(welcomeRoute.baseSelector, (state) => Object.values(state.users))
}
