import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { COLORS } from "../../Constants";
import { validateData, signUp, checkAuth } from "..//../helpers/api-helper";
import { RegisterSuccess, LoginSuccess } from "../../reducer/actions";

export default function Register() {
  const { role } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfpassword, setCfpassword] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [seats, setSeats] = useState(0);
  const [error, setError] = useState(null);
  // const {name, email, password, make, model, plate, seats, error } = useSelector(state=> state.user)
  const dispatch = useDispatch();
  const history = useHistory();

  // Authentication check
  const checkAuth = async () => {
    const res = await fetch("/users/login");
    if (!res.ok) {
      const user = await res.json();
      dispatch(LoginSuccess(user));
      history.push("/");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateData({
      name,
      email,
      password,
      cfpassword,
      make,
      model,
      plate,
      seats,
      driver: role === "driver",
    });
    if (errors.length > 0) {
      setError(errors);
    } else {
      const res = await signUp();
      if (!res.ok) {
        const jsonData = await res.json();
        errors.push(jsonData);
      } else {
        const jsonDataSuccess = await res.json();
        dispatch(RegisterSuccess(jsonDataSuccess.msg));
        history.push("/users/login");
      }
    }
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
        {error && (
          <ErrorMsg>
            {error.map((err, index) => (
              <li key={index}>{err.msg}</li>
            ))}
          </ErrorMsg>
        )}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <label htmlFor="cfpassword">Confirm Password</label>
        <input
          type="password"
          name="cfpassword"
          id="cfpassword"
          value={cfpassword}
          onChange={(e) => setCfpassword(e.target.value)}
          required
        />
        {role === "driver" && (
          <>
            <h2>Car Information</h2>
            <label htmlFor="make">Make</label>
            <input
              type="text"
              name="make"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
            />
            <label htmlFor="model">Model</label>
            <input
              type="text"
              name="model"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
            <label htmlFor="plate">Plate No.</label>
            <input
              type="text"
              name="plate"
              id="plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              required
            />
            <label htmlFor="seats">Available Seats</label>
            <input
              type="number"
              name="seats"
              id="seats"
              min="1"
              max="5"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
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

const ErrorMsg = styled.ul`
  li {
    list-style: square;
    padding: 10px;
    margin: 10px 0;
    background-color: ${COLORS.appleCore};
    color: white;
    border-radius: 4px;
    box-shadow: 0 0 5px 1px lightgrey;
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
