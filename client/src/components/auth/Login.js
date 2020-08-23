import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { COLORS } from "../../Constants";

const Login = () => {
  return (
    <Wrapper>
      <h1>Log In</h1>
      <Form>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required />
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

export default Login;
