import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./components/GlobalStyles";
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import MatchedTrips from "./components/MatchedTrips";
import TripDetail from "./components/TripDetail";
import Mytrips from "./components/Mytrips";

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
          <Route path="/trips/users/:userId">
            <Mytrips />
          </Route>
          <Route path="/trips/MatchedTrips/:_id">
            <MatchedTrips />
          </Route>
          <Route path="/trips/details/:_id">
            <TripDetail />
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
