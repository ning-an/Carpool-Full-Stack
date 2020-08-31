import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { COLORS } from "../Constants";
import {
  addInvite,
  cancelInvite,
  addPick,
  cancelPick,
} from "../helpers/api-helper";
import { SubtractSeats } from "../reducer/actions";

export default function Trip(props) {
  const { seats: availableSeats } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    origin,
    destination,
    seats,
    earlySchedule,
    lateSchedule,
    beDriver,
    matchedTrip_id,
    myTrip_id,
    invite,
    match,
  } = props;

  const [hasInvited, setHasInvited] = useState(() =>
    invite.includes(myTrip_id)
  );
  const [hasPicked, setHasPicked] = useState(() => match.includes(myTrip_id));

  const handleInvite = async () => {
    if (hasInvited) {
      await cancelInvite(matchedTrip_id, myTrip_id);
    } else {
      await addInvite(matchedTrip_id, myTrip_id);
    }
    setHasInvited(!hasInvited);
  };

  const handlePick = async () => {
    if (hasPicked) {
      const status = availableSeats + seats > 0 ? "idle" : "matched";
      await cancelPick(matchedTrip_id, myTrip_id, seats, status);
      dispatch(SubtractSeats(-seats));
    } else {
      const status = seats >= availableSeats ? "matched" : "idle";
      await addPick(matchedTrip_id, myTrip_id, seats, status);
      dispatch(SubtractSeats(seats));
    }
    setHasPicked(!hasPicked);
  };

  return (
    <Wrapper>
      <Row>
        <LeftCol>From</LeftCol>
        <RightCol>{origin}</RightCol>
      </Row>
      <Row>
        <LeftCol>To</LeftCol>
        <RightCol>{destination}</RightCol>
      </Row>
      <Row>
        {earlySchedule} - {lateSchedule}
      </Row>
      <Row>
        <LeftCol>
          {beDriver ? "Offer" : "Want"} <Seats>{seats}</Seats> seat(s){" "}
        </LeftCol>
        <RightCol>
          {beDriver ? (
            <StyledBtn onClick={handleInvite} hasInvited={hasInvited}>
              {hasInvited ? "Cancel" : "Invite"}
            </StyledBtn>
          ) : (
            <StyledBtn
              onClick={handlePick}
              hasPicked={hasPicked}
              disabled={availableSeats < seats}
            >
              {hasPicked ? "Cancel" : "Pick"}
            </StyledBtn>
          )}
        </RightCol>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: ${COLORS.appleCore};
  color: white;
  border-radius: 4px;
  margin-top: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const LeftCol = styled.div`
  flex-basis: 20%;
  font-weight: bold;
`;

const RightCol = styled.div`
  position: relative;
  flex-basis: 70%;
`;

const Seats = styled.span`
  color: ${COLORS.apricot};
  font-size: 1.5em;
  margin: 0 10px;
`;

const StyledBtn = styled.button`
  background-color: ${COLORS.blueberry};
  color: white;
  font-size: 16px;
  position: absolute;
  right: 0;
  top: -5px;
  border-radius: 4px;
  padding: 8px 30px;
  box-shadow: 0 0 5px 1px lightgrey;

  ${({ hasInvited }) => hasInvited && "filter: brightness(60%)"};
  ${({ hasPicked }) => hasPicked && "filter: brightness(60%)"};

  &:hover {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
    color: #c0c0c0;
    background-color: #ffffff;
  }
`;
