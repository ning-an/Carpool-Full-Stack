import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import GlobalStyle from "./components/GlobalStyles";
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Router>
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
        </Switch>
      </Router>
    </>
  );
}

export default App;
