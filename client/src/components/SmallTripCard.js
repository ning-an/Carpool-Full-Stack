import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { COLORS } from "../Constants";
import {
  addInvite,
  cancelInvite,
  addPick,
  cancelPick,
  cancelPost,
} from "../helpers/api-helper";
import { SubtractSeats, CancelTrip } from "../reducer/actions";

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
    label,
    status,
  } = props;

  const [hasInvited, setHasInvited] = useState(
    () => invite.includes(myTrip_id) || label === "invitations"
  );
  const [hasPicked, setHasPicked] = useState(() => match.includes(myTrip_id));
  const [hasCancelled, setHasCancelled] = useState(
    () => status === "cancelled"
  );

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

  const handleCancel = async () => {
    if (!hasCancelled) {
      await cancelPost(matchedTrip_id, invite, match);
      setHasCancelled(true);
      dispatch(CancelTrip());
    }
  };

  return (
    <Wrapper>
      <Cols>
        <Left>From</Left>
        <Left>To</Left>
        <Left>
          {beDriver ? "Offer" : "Want"} <Seats>{seats}</Seats> seat(s){" "}
        </Left>
      </Cols>
      <Cols>
        <Middle>{origin}</Middle>
        <Middle>{destination}</Middle>
        <Middle>
          {earlySchedule} ---- {lateSchedule}
        </Middle>
      </Cols>
      <Cols>
        {(label === "matchedTrips" || label === "invitations") &&
          (beDriver ? (
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
          ))}
        {(label === "historyTrips" || label === "detail") && (
          <>
            {label === "historyTrips" && (
              <StyledBtn disabled={hasCancelled === true}>
                <Link to={`/trips/details/${matchedTrip_id}`}>Details</Link>
              </StyledBtn>
            )}
            <StyledBtn
              disabled={status === "fulfilled" || hasCancelled === true}
              onClick={handleCancel}
            >
              {status === "fulfilled"
                ? "Completed"
                : hasCancelled
                ? "Cancelled"
                : "Cancel"}
            </StyledBtn>
          </>
        )}
      </Cols>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  justify-content: space-evenly;
  background-color: ${COLORS.blueberry};
  color: white;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 0 10px 1px grey;
`;

const Cols = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Left = styled.div`
  text-align: left;
  width: 200px;
`;

const Middle = styled.div`
  text-align: center;
  width: 800px;
  margin-left: -80px;
`;

const Seats = styled.span`
  color: ${COLORS.apricot};
  font-size: 1.5em;
  margin: 0 10px;
`;

const StyledBtn = styled.button`
  background-color: ${COLORS.apricot};
  color: white;
  font-size: 20px;
  border-radius: 4px;
  box-shadow: 0 0 5px 0.5px lightgrey;
  width: 120px;
  height: 40px;

  ${({ hasInvited }) => hasInvited && "filter: brightness(60%)"};
  ${({ hasPicked }) => hasPicked && "filter: brightness(60%)"};

  &:hover {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
    color: #c0c0c0;
    background-color: #f0f0f0;
  }

  a {
    color: white;

    &:visited {
      color: white;
    }
  }
`;
