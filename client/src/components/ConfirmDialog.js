import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";

import { calcPriceByDistance } from "../helpers/handlers";
import { QuitPost, PostTrip } from "../reducer/actions";
import { COLORS } from "../Constants";
import { postNewTrip } from "../helpers/api-helper";

export default function Dialog() {
  const { origin, destination, distanceTxt, distanceNum } = useSelector(
    (state) => state.trip
  );
  const {
    seats,
    earlyDate,
    earlyTime,
    lateDate,
    lateTime,
    status,
    beDriver,
  } = useSelector((state) => state.user);
  const { driver, name, status: loginStatus } = useSelector(
    (state) => state.login
  );
  const dispatch = useDispatch();
  const history = useHistory();

  // Data vapdation
  const errors = [];
  const earlySchedule = earlyDate + " " + earlyTime;
  const lateSchedule = lateDate + " " + lateTime;
  if (
    !origin ||
    !destination ||
    !seats ||
    !earlyDate ||
    !earlyTime ||
    !lateDate ||
    !lateTime
  ) {
    errors.push("Please fill in all the fields.");
  }
  if (moment(earlySchedule).isBefore(moment())) {
    errors.push("You can not set a leaving time before now.");
  }
  if (moment(lateSchedule).isAfter(moment().add(7, "d"))) {
    errors.push("You can not post a trip after 7 days.");
  }
  if (moment(earlySchedule).isAfter(moment(lateSchedule))) {
    errors.push(
      "The latest leaving time can not be earlier than the earliest leaving time."
    );
  }

  // Calc price
  const passengerPrice = calcPriceByDistance(distanceNum, seats);
  const driverGainL = calcPriceByDistance(distanceNum, seats); // lowest gain when passengers are from 1 order
  const driverGainH = calcPriceByDistance(distanceNum, 1) * seats; // highest gain with full load while each passenger has its own order

  // Post trip btn click handler
  const postTripHandler = async () => {
    const { _id } = await postNewTrip({
      origin,
      destination,
      seats,
      earlySchedule,
      lateSchedule,
      beDriver,
    });
    dispatch(PostTrip());
    history.push(`/trips/MatchedTrips/${_id}`);
  };

  if (errors.length > 0 && status === "pending") {
    return (
      <>
        <Backdrop />
        <ErrWrapper>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
          <CloseBtn onClick={() => dispatch(QuitPost())}>X</CloseBtn>
        </ErrWrapper>
      </>
    );
  } else {
    return (
      <>
        <Backdrop />
        <ConfirmWrapper>
          <h3>Hello {name}</h3>
          <p>Please confirm your trip below.</p>
          <Row>
            {origin.city} - {destination.city} ({distanceTxt})
          </Row>
          <Row>
            <LeftCol>Leave</LeftCol>
            <RightCol>
              {earlySchedule} to {lateSchedule}
            </RightCol>
          </Row>
          <Row>
            <LeftCol>{driver ? "Offer" : "Want"}</LeftCol>
            <RightCol>{seats} seats</RightCol>
          </Row>
          <Row>
            <LeftCol>{driver ? "Gain" : "Price"}</LeftCol>
            <RightCol>
              {driver
                ? `${driverGainL} - ${driverGainH}$`
                : `${passengerPrice}$`}
            </RightCol>
          </Row>
          <Row>
            <ConfirmBtn onClick={() => dispatch(QuitPost())}>Cancel</ConfirmBtn>
            {loginStatus === "logged-in" ? (
              <ConfirmBtn onClick={postTripHandler}>Post</ConfirmBtn>
            ) : (
              <ConfirmBtn>
                <Link to="/login">Login Now</Link>
              </ConfirmBtn>
            )}
          </Row>
        </ConfirmWrapper>
      </>
    );
  }
}

const Backdrop = styled.div`
  position: fixed;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.7;
  background-color: black;
  z-index: 2;
`;

const Wrapper = styled.div`
  z-index: 5;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 255px;
  box-shadow: 0 0 5px 1px lightgrey;
  border-radius: 4px;
  color: white;
  padding: 20px;

  p {
    margin: 10px 0 10px 10px;
  }
`;

const ErrWrapper = styled(Wrapper)`
  background-color: ${COLORS.apricot};
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
  border-radius: 50%;
  width: 25px;
  height: 25px;
`;

const ConfirmWrapper = styled(Wrapper)`
  background-color: ${COLORS.blueberry};
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const LeftCol = styled.div`
  flex-basis: 20%;
`;

const RightCol = styled.div`
  flex-basis: 80%;
`;

const ConfirmBtn = styled.button`
  width: 120px;
  padding: 5px;
  background-color: ${COLORS.apricot};
  color: white;
  border-radius: 4px;
  box-shadow: 0 0 5px 1px lightgrey;
  margin: 40px 40px 10px;

  &:hover {
    transform: scale(0.98);
  }
`;
