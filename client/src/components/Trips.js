import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import SmallTripCard from "./SmallTripCard";
import { getCurrentTrip, getMatchedTrips } from "../helpers/api-helper";
import { AddSeats } from "../reducer/actions";

export default function Trips() {
  // const { matchedTrips } = useSelector((state) => state.user);
  const { _id } = useParams();
  const [matchedTrips, setMatchedTrips] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentTrip(_id).then((res) => {
      if (res.trip) {
        setCurrentTrip(res.trip);
        dispatch(AddSeats(res.trip.seats));
      }
    });
    getMatchedTrips(_id).then((res) => {
      setMatchedTrips(res.matchedTrips);
    });
  }, []);

  // If passenger's picked or driver's full load, redirect to trip tracking page
  if (currentTrip && currentTrip.status === "matched") {
    history.push(`/trips/confirmation/${_id}`);
  }

  return (
    <ul>
      {matchedTrips ? (
        matchedTrips.map((trip) => (
          <li key={trip._id}>
            <SmallTripCard
              origin={trip.origin.address}
              destination={trip.destination.address}
              seats={trip.seats}
              earlySchedule={trip.earlySchedule}
              lateSchedule={trip.lateSchedule}
              beDriver={trip.beDriver}
              matchedTrip_id={trip._id}
              myTrip_id={_id}
              invite={trip.invite}
              match={trip.match}
            />
          </li>
        ))
      ) : (
        <li>No matched trips</li>
      )}
    </ul>
  );
}
