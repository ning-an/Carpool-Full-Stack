import React from "react";
import styled from "styled-components";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

import { COLORS } from "../Constants";
import {
  AddSeats,
  AddEarlyDate,
  AddEarlyTime,
  AddLateDate,
  AddLateTime,
  SubmitTrip,
  SelectRole,
} from "../reducer/actions";
import Dialog from "./ConfirmDialog";

export default function TripForm() {
  const { driver } = useSelector((state) => state.login);
  const { status } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleRadioClick = (e) => {
    dispatch(SelectRole(e.target.value === "driver"));
  };

  const handleBtnClick = () => {
    dispatch(SubmitTrip());
  };

  return (
    <Wrapper>
      {driver && (
        <RoleSelct>
          <input
            type="radio"
            id="passenger"
            name="role"
            value="passenger"
            // checked
            onClick={handleRadioClick}
          />
          <label htmlFor="passenger">Passenger</label>
          <input
            type="radio"
            id="driver"
            name="role"
            value="driver"
            onClick={handleRadioClick}
          />
          <label htmlFor="driver">Driver</label>
        </RoleSelct>
      )}
      <InputSec driver={driver}>
        <InputSubSec>
          <label htmlFor="seats">Seats</label>
          <select
            name="seats"
            id="seats"
            onChange={(e) => dispatch(AddSeats(Number(e.target.value)))}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </InputSubSec>
        <MiddleLine />
        <Schedules>
          <div>
            <label htmlFor="earliest">Earliest</label>
            <input
              type="date"
              name="datemin"
              id="datemin"
              min={moment().format("YYYY-MM-DD")}
              max={moment().add(7, "days").format("YYYY-MM-DD")}
              onChange={(e) => dispatch(AddEarlyDate(e.target.value))}
            />
            <input
              type="time"
              name="timemin"
              id="timemin"
              min={moment().format("LT")}
              onChange={(e) => dispatch(AddEarlyTime(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="latest">Latest</label>
            <input
              type="date"
              name="datemax"
              id="datemax"
              min={moment().format("YYYY-MM-DD")}
              max={moment().add(7, "days").format("YYYY-MM-DD")}
              onChange={(e) => dispatch(AddLateDate(e.target.value))}
            />
            <input
              type="time"
              name="timemax"
              id="timemax"
              max={moment().format("LT")}
              onChange={(e) => dispatch(AddLateTime(e.target.value))}
            />
          </div>
        </Schedules>
        <SubmitBtn onClick={handleBtnClick}>GO</SubmitBtn>
      </InputSec>
      {status === "pending" && <Dialog />}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputSec = styled.div`
  margin-top: ${({ driver }) => driver || "100px"};
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: ${COLORS.blueberry};
  color: white;
  padding: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  select {
    border: none;
    padding: 5px;
    background: transparent;
    border-bottom: solid 1px white;
    color: white;

    &:focus {
      outline: none;
    }
  }
`;

const RoleSelct = styled.div`
  border: solid 3px ${COLORS.apricot};
  border-radius: 10px;
  overflow: hidden;
  margin-top: 100px;
  display: inline-block;

  input {
    display: none;
  }
  label {
    color: white;
    display: inline-block;
    cursor: pointer;
    font-weight: bold;
    width: 122px;
    margin: 0;
    padding: 5px;
    text-align: center;
    background: ${COLORS.apricot};
    filter: brightness(80%);
  }

  input:checked + label {
    filter: brightness(100%);
  }

  label + input + label {
    border-left: solid 3px ${COLORS.apricot};
  }
`;

const Schedules = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 3;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-left: 10px;
  }

  input {
    border: none;
    min-width: 120px;
    max-width: 150px;
    height: 30px;
    background: transparent;
    color: white;
    border-bottom: 1px solid white;
    margin-bottom: 5px;
    padding: 0 5px;
  }
`;

const InputSubSec = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex: 1 1 1;
  margin-right: 10px;
`;

const MiddleLine = styled.div`
  border: solid 1px white;
  height: 60px;

  @media (max-width: 768px) {
    height: 0;
    width: 500px;
    margin: 10px;
  }
`;

const SubmitBtn = styled.button`
  background-color: ${COLORS.apricot};
  color: white;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 5px 0.5px lightgrey;
  width: 120px;
  height: 40px;
  font-size: 20px;
  margin: 10px;

  @media (max-width: 768px) {
    padding: 10px 40px;
  }
`;
