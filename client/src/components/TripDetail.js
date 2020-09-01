import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { getCurrentTrip } from "../helpers/api-helper";
import SmallTripCard from "./SmallTripCard";
import { InitTrip } from "../reducer/actions";

export default function Tracking() {
  const { _id } = useParams();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [currentInvites, setCurrentInvites] = useState(null);
  const [currentMatches, setCurrentMatches] = useState(null);
  const { status: cancelStatus } = useSelector((state) => state.tripMng);
  const dispatch = useDispatch();

  const initialize = async () => {
    // set reducer status tracker to be active
    dispatch(InitTrip());

    // get current trip info
    const res = await getCurrentTrip(_id);

    const { invite, match } = res.trip;
    // get all invites
    const inviteArray = [];
    if (invite.length > 0) {
      for (const id of invite) {
        const res = await getCurrentTrip(id);
        inviteArray.push(res.trip);
      }
    }
    const filterInviteArray = inviteArray.filter(
      (elem) => elem.status === "idle"
    );
    setCurrentInvites(
      filterInviteArray.length === 0 ? null : filterInviteArray
    );

    // get all matches
    const matchArray = [];
    if (match.length > 0) {
      for (const id of match) {
        const res = await getCurrentTrip(id);
        matchArray.push(res.trip);
      }
    }
    const filterMatchArray = matchArray.filter(
      (elem) => elem.status === "idle"
    );
    setCurrentMatches(filterMatchArray.length === 0 ? null : filterMatchArray);
    setCurrentTrip(res.trip);
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <SecWrapper>
        <h2>My Trip</h2>
        {currentTrip && (
          <SmallTripCard
            origin={currentTrip.origin.address}
            destination={currentTrip.destination.address}
            seats={currentTrip.seats}
            earlySchedule={currentTrip.earlySchedule}
            lateSchedule={currentTrip.lateSchedule}
            beDriver={currentTrip.beDriver}
            matchedTrip_id={_id}
            invite={currentTrip.invite}
            match={currentTrip.match}
            status={currentTrip.status}
            label="detail"
          />
        )}
      </SecWrapper>
      {cancelStatus === "active" && (
        <>
          {currentMatches && (
            <SecWrapper>
              <h2>My Matches</h2>
              <ul>
                {currentMatches.map((trip) => (
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
                      label="matched"
                    />
                  </li>
                ))}
              </ul>
            </SecWrapper>
          )}
          {/* show invites only if the trip is not matched yet */}
          {currentInvites && currentTrip && currentTrip.status !== "matched" && (
            <SecWrapper>
              <h2>My Invitations</h2>
              <ul>
                {currentInvites.map((trip) => (
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
                      label="invitations"
                    />
                  </li>
                ))}
              </ul>
            </SecWrapper>
          )}
        </>
      )}
    </>
  );
}

const SecWrapper = styled.div`
  h2 {
    font-size: 24px;
    margin-top: 20px;
    margin-left: 10px;
  }
`;
