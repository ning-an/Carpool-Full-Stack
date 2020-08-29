import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./components/GlobalStyles";
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Test from "./components/Test";

function App() {
  return (
    <Wrapper>
      <GlobalStyle />
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/users/register/:role">
            <Register />
          </Route>
          <Route path="/users/login">
            <Login />
          </Route>
          <Route path="/test">
            <Test />
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 0 50px;
`;

export default App;
