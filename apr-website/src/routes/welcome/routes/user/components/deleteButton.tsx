import React from 'react'
import { userRoute } from '..';
import { selectedUser } from '../redux/selectors';
import userReducer, { User } from '../../../userListReducer';
export const DeleteButton = userRoute.connect(state => ({
  selectedUser: selectedUser(state as any)
}), {
    onClick: userReducer.actionCreators.deleteUser
  })(
    (props: { selectedUser: User, onClick: (id: string) => any }) => (
      <button
        onClick={() => props.onClick(props.selectedUser.id)}
      >
        Delete {props.selectedUser.name}
      </button>
    )
  )
