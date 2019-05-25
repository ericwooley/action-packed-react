import * as React from "react";
import { userList } from './userlist'
import { userRoute } from './routes/user/user'

export const Welcome = (props: {
  children: React.ComponentElement<any, any>;
  params: {}
}) => (
    <div>
      <h1>Select A User</h1>
      {userList.map(user => <div key={user} ><userRoute.Link name={user}>{user}</userRoute.Link></div>)}
      {props.children}
    </div>
  );
