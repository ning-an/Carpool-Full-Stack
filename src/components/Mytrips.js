import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";

import { getTripsForCurrentUser } from "../helpers/api-helper";
import SmallTripCard from "./SmallTripCard";
import { COLORS } from "../Constants";

export default function Mytrips() {
  const { userId } = useParams();
  const [allTrips, setAllTrips] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (userId) {
      getTripsForCurrentUser(userId).then((res) => {
        setAllTrips(res.trips);
      });
    }
  }, []);

  const clickLoginBtn = () => {
    history.push("/login");
  };

  return (
    <>
      {allTrips ? (
        <ul>
          {allTrips.map((trip) => (
            <li key={trip._id}>
              <SmallTripCard
                origin={trip.origin.address}
                destination={trip.destination.address}
                seats={trip.seats}
                earlySchedule={trip.earlySchedule}
                lateSchedule={trip.lateSchedule}
                beDriver={trip.beDriver}
                matchedTrip_id={trip._id}
                invite={trip.invite}
                match={trip.match}
                status={trip.status}
                label="historyTrips"
              />
            </li>
          ))}
        </ul>
      ) : (
        <StyledBtn onClick={clickLoginBtn}>Login</StyledBtn>
      )}
    </>
  );
}

const StyledBtn = styled.button`
  background-color: ${COLORS.apricot};
  color: white;
  width: 120px;
  height: 40px;
  border-radius: 4px;
  font-size: 20px;
  margin: 20px 40px;
`;
