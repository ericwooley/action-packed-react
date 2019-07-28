import * as React from "react";
import { userRoute } from './routes/user'
import {User} from './redux/userListReducer'
import { selectors } from "./redux/selectors";
import { welcomeRoute } from ".";

const Welcome = (props: {
  children?: React.ReactChildren;
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
