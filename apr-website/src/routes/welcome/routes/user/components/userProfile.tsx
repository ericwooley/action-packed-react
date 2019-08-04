import React from "react";
import { IParams, userRoute } from "..";
import { DeleteButton } from "../components/deleteButton";
import { selectedUser } from "../redux/selectors";
import { User } from "../../../redux/userListReducer";
import { welcomeRoute } from "../../..";

const UserProfileComponent = (props: { params?: IParams; selectedUser: User }) => {
  const { selectedUser } = props;
  if (!selectedUser) return <welcomeRoute.Link redirect={true} />;
  return (
    <div>
      <h1>{selectedUser.name}</h1>
      <p>{selectedUser.quote}</p>
      <DeleteButton />
    </div>
  );
};
export const userProfile = userRoute.connect(state => ({
  selectedUser: selectedUser(state)
}))(UserProfileComponent);