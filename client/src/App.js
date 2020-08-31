import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./components/GlobalStyles";
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Test from "./components/Test";
import Trips from "./components/Trips";
import Confirmation from "./components/Confirmation";

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
          <Route path="/register/:role">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/trips/:_id">
            <Trips />
          </Route>
          <Route path="/trips/confirmation/:_id">
            <Confirmation />
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
