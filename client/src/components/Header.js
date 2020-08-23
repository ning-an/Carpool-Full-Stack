import React from "react";
import styled from "styled-components";

import { AiOutlineHome } from "react-icons/ai";
import { MdMyLocation } from "react-icons/md";
import Logo from "../logo.png";

export default function Header() {
  return (
    <Wrapper>
      <AiOutlineHome style={IconStyle} />
      <Trademark>
        <img src={Logo} alt="company logo" />
        <h1>VROOM</h1>
      </Trademark>
      <MdMyLocation style={IconStyle} />
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
