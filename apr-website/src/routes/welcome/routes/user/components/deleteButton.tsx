import React from "react";
import { userRoute } from "..";
import { selectedUser } from "../redux/selectors";
import userReducer, { User } from "../../../redux/userListReducer";
export const DeleteButton = userRoute.connect(
  state => ({
    selectedUser: selectedUser(state as any)
  }),
  {
    onClick: userReducer.actionCreators.deleteUser
  }
)((props: { selectedUser: User; onClick: (id: string) => any }) => {
  const onClickHandler = React.useCallback(() => props.onClick(props.selectedUser.id), [
    props.selectedUser.id
  ]);
  return <button onClick={onClickHandler}>Delete {props.selectedUser.name}</button>;
});