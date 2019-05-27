import * as React from "react";
import styled from "styled-components";
import { welcomeRoute } from "./routes/welcome";
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const Nav = styled.div`
  flex: 0;
  padding: 10px;
  margin: 10px;
  min-width: 300px;
  border: 1px solid lightgreen;
  border-radius: 20px;
`;
export class RootLayout extends React.PureComponent {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Wrapper>
        <Nav>
          <ul>
            <li>
              <welcomeRoute.Link>User Directory</welcomeRoute.Link>
            </li>
          </ul>
        </Nav>
        <div>{this.props.children}</div>
      </Wrapper>
    );
  }
}