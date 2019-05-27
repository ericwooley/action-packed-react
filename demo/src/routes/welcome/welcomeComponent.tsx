import * as React from "react";
import { userRoute } from './routes/user'
import { User, selectors } from "./userListReducer";
import { welcomeRoute } from ".";

const Welcome = (props: {
  children: React.ComponentElement<any, any>;
  params: {},
  userList: User[]
}) => (
    <div>
      <h1>Select A User</h1>
      {props.userList.map(user => <div key={user.name} >
        <userRoute.Link id={user.id}>{user.name}</userRoute.Link>
      </div>)}
      {props.children}
    </div>
  );

export default welcomeRoute.connect((state) => ({
  userList: selectors.userList(state)
}))(Welcome)