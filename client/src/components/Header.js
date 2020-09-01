import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory, Link } from "react-router-dom";

import { AiOutlineHome } from "react-icons/ai";
import Logo from "../logo.png";
import { COLORS } from "../Constants";
import { logout } from "../helpers/api-helper";
import { Logout } from "../reducer/actions";

export default function Header() {
  const { status, userId } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutHandler = async () => {
    await logout();
    dispatch(Logout());
    history.push("/login");
  };

  return (
    <Wrapper>
      <Link to="/" style={{ width: "200px", paddingTop: "5px" }}>
        <AiOutlineHome style={IconStyle} />
      </Link>
      <Link to={`/trips/users/${userId}`}>
        <Trademark>
          <img src={Logo} alt="company logo" />
          <h1>VROOM</h1>
        </Trademark>
      </Link>
      {status === "logged-in" ? (
        <LogoutBtn onClick={logoutHandler}>Log Out</LogoutBtn>
      ) : (
        <BtnDiv>
          <NavLink to="/register/passenger" activeClassName="selected">
            Sign Up
          </NavLink>
          <NavLink to="/login" activeClassName="selected">
            Login
          </NavLink>
        </BtnDiv>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /* width: 100vw; */
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 1px 10px 1px lightgrey;

  a {
    color: black;

    &:visited,
    &:active {
      color: black;
    }
  }
`;

const Trademark = styled.div`
  width: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    width: 20px;
  }
`;

const IconStyle = {
  fontSize: "1.5em",
};

const LogoutBtn = styled.button`
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 16px;
  width: 200px;
  text-align: right;
`;

const BtnDiv = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;

  a {
    padding: 10px;
    margin: 10px;
  }

  .selected {
    background-color: ${COLORS.apricot};
    border-radius: 4px;
    box-shadow: 0 0 10px 1px lightgrey;
    color: white;
  }
`;
