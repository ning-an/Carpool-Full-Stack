import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";

import { COLORS } from "../../Constants";
// import SignupForm from "./SignupForm";
import { signup } from "..//../helpers/api-helper";

export default function Register() {
  const { role } = useParams();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      cfpassword,
      make,
      model,
      plate,
      seats,
    } = e.target;
    let userData = {
      name: name.value,
      email: email.value,
      password: password.value,
      cfpassword: cfpassword.value,
      driver: false,
    };
    if (role === "driver") {
      userData = {
        ...userData,
        driver: true,
        make: make.value,
        model: model.value,
        plate: plate.value,
        seats: seats.value,
      };
    }
    signup(userData);
    history.push("/users/login");
  };
  return (
    <Wrapper>
      <h1>Sign up</h1>
      <Tabs>
        <li>
          <Link to="/users/register/passenger">Passenger</Link>
        </li>
        <li>
          <Link to="/users/register/driver">Driver</Link>
        </li>
      </Tabs>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required />
        <label htmlFor="cfpassword">Confirm Password</label>
        <input type="password" name="cfpassword" id="cfpassword" required />
        {role === "driver" && (
          <>
            <h2>Car Information</h2>
            <label htmlFor="make">Make</label>
            <input type="text" name="make" id="make" required />
            <label htmlFor="model">Model</label>
            <input type="text" name="model" id="model" required />
            <label htmlFor="plate">Plate No.</label>
            <input type="text" name="plate" id="plate" required />
            <label htmlFor="seats">Available Seats</label>
            <input
              type="number"
              name="seats"
              id="seats"
              min="1"
              max="5"
              required
            />
          </>
        )}
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/users/login"> Login</Link>
        </p>
      </Form>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin: 30px;
    font-size: 32px;
  }
`;

const Tabs = styled.ul`
  display: flex;
  position: relative;
  left: -100px;

  li {
    background-color: ${COLORS.apricot};
    padding: 10px 20px 5px;
    margin-right: 10px;
    transform: skewX(-20deg);
    border-radius: 4px;
  }

  a {
    display: block;
    transform: skewX(20deg);

    &:visited {
      color: white;
    }
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

  h2 {
    margin-top: 30px;
    border-top: 1px solid ${COLORS.apricot};
    padding-top: 10px;
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
