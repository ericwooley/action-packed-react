import React, { useCallback } from "react";
import reducer, { selectors } from "./contactUsReducer";
import { contactUsRoute } from ".";

interface IContactUsTypes {
  children?: React.ReactChildren;
  email: string,
  onEmailChange: (email: string) => any
}

const Welcome = (props: IContactUsTypes) => (
  <div>
    <h1>Contact Us</h1>
    <form>
      <input
        type="email"
        placeholder="email"
        onChange={useCallback((e) => props.onEmailChange(e.currentTarget.value), [])} />
    </form>
    {props.children}
  </div>
);

export default contactUsRoute.connect((state) => ({
  email: selectors.email(state)
}), {
    onEmailChange: reducer.actionCreators.setEmail
  })(Welcome)
