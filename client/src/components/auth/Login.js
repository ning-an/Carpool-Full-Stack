import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { COLORS } from "../../Constants";
import { login } from "../../helpers/api-helper";
import { LoginFailure, LoginSuccess } from "../../reducer/actions";

const Login = () => {
  const { status, msg } = useSelector((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    fetch("/users/login").then((res) => {
      if (!res.ok) {
        history.push("/");
      }
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (!res.ok) {
      const jsonData = await res.json();
      console.log(jsonData);
      dispatch(LoginFailure(jsonData.msg));
    } else {
      dispatch(LoginSuccess());
      history.push("/");
    }
  };
  return (
    <Wrapper>
      <h1>Login</h1>
      <Form onSubmit={handleLogin}>
        {status !== "idle" && <Msg>{msg}</Msg>}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button>Log in</button>
        <p>
          Not registered yet?
          <Link to="/users/register/passenger"> Sign up</Link>
        </p>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin: 30px;
    font-size: 32px;
  }
`;

const Form = styled.form`
  width: 400px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 5px 2px lightgrey;

  label {
    display: block;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    height: 36px;
    border-radius: 4px;
    border: none;
    box-shadow: 0 0 3px 1px lightgrey;
  }

  button {
    box-sizing: border-box;
    width: 100%;
    height: 36px;
    font-size: 100%;
    background-color: ${COLORS.apricot};
    color: white;
    border-radius: 4px;
    border: none;
    margin: 20px 0;
  }
  a {
    color: ${COLORS.citrus};
  }
`;

const Msg = styled.div`
  padding: 10px;
  margin: 10px 0;
  background-color: ${COLORS.appleCore};
  color: white;
  border-radius: 4px;
  box-shadow: 0 0 5px 1px lightgrey;
`;

export default Login;
