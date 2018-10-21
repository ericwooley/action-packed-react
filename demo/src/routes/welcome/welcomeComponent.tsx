import * as React from "react";
export const Welcome = (props: {
  children: React.ComponentElement<any, any>;
}) => (
  <div>
    <h1>Welcome</h1>
    {props.children}
  </div>
);
