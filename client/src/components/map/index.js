import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "react-google-maps";
import Geocode from "react-geocode";
import { useDispatch } from "react-redux";

import { PrepareTrip } from "../../reducer/actions";

const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
Geocode.setApiKey(API_KEY);

const MapWithAMarker = withScriptjs(
  withGoogleMap((props) => {
    // State hooks
    const [start, setStart] = useState({ lat: 45.5, lng: -73.56 });
    const [end, setEnd] = useState(null);
    const [fromInput, setFromInput] = useState("");
    const [toInput, setToInput] = useState("");
    const [direction, setDirection] = useState(null);

    // Ref hooks
    const refInput = useRef(null);
    const refInputDest = useRef(null);

    const dispatch = useDispatch();

    // Prepare direction route services
    const directionsService = new window.google.maps.DirectionsService();

    if (start && end) {
      directionsService.route(
        {
          origin: { lat: start.lat, lng: start.lng },
          destination: { lat: end.lat, lng: end.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (res, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const {
              text: distanceTxt,
              value: distanceNum,
            } = res.routes[0].legs[0].distance;
            setDirection(res);
            dispatch(PrepareTrip({ start, end, distanceTxt, distanceNum }));
          } else {
            console.error(`error fetching directions ${res}`);
          }
        }
      );
    }

    // Get current location
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newLat = pos.coords.latitude;
            const newLng = pos.coords.longitude;
            Geocode.fromLatLng(newLat, newLng).then((res) => {
              const addressArray = res.results[0].address_components;
              const city = addressArray.find(
                (elem) =>
                  elem.types.includes("locality") ||
                  elem.types.includes("administrative_area_level_2") ||
                  elem.types.includes("administrative_area_level_1")
              ).long_name;
              const state = addressArray.find(
                (elem) => elem.types[0] === "administrative_area_level_1"
              ).long_name;
              const address = {
                address: res.results[0].formatted_address,
                city,
                state,
                lat: newLat,
                lng: newLng,
              };
              setStart(address);
              setFromInput(address.address);
            });
          },
          (err) => {
            console.warn(`ERROR(${err.code}: ${err.message})`);
          }
        );
      }
    }, []);

    // Start point input area with google place autocomplete
    useEffect(() => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        refInput.current
      );

      // Place_change event handler
      const handlePlaceChange = () => {
        const place = autocomplete.getPlace();
        const startAddress = {
          address: place.formatted_address,
          city: place.address_components.find(
            (elem) =>
              elem.types.includes("locality") ||
              elem.types.includes("administrative_area_level_2") ||
              elem.types.includes("administrative_area_level_1")
          ).long_name,
          state: place.address_components.find(
            (elem) => elem.types[0] === "administrative_area_level_1"
          ).long_name,
          lng: place.geometry.viewport.Va.i,
          lat: place.geometry.viewport.Za.i,
        };
        setStart(startAddress);
        setFromInput(startAddress.address);
      };

      // Add listener
      const listener = autocomplete.addListener(
        "place_changed",
        handlePlaceChange
      );
      // Remove listener
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }, [start]);

    // Destination input area with google place autocomplete
    useEffect(() => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        refInputDest.current
      );
      // Place_change event handler
      const handlePlaceChange = () => {
        const place = autocomplete.getPlace();
        const endAddress = {
          address: place.formatted_address,
          city: place.address_components.find(
            (elem) =>
              elem.types.includes("locality") ||
              elem.types.includes("administrative_area_level_2") ||
              elem.types.includes("administrative_area_level_1")
          ).long_name,
          state: place.address_components.find(
            (elem) => elem.types[0] === "administrative_area_level_1"
          ).long_name,
          lng: place.geometry.viewport.Va.i,
          lat: place.geometry.viewport.Za.i,
        };
        setEnd(endAddress);
        setToInput(endAddress.address);
      };

      // Add listener
      const listener = autocomplete.addListener(
        "place_changed",
        handlePlaceChange
      );
      // Remove listener
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }, [end]);

    // drag maker event handler
    const onMarkerDragEnd = (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      Geocode.fromLatLng(newLat, newLng).then((res) => {
        const addressArray = res.results[0].address_components;
        const city = addressArray.find(
          (elem) =>
            elem.types.includes("locality") ||
            elem.types.includes("administrative_area_level_2") ||
            elem.types.includes("administrative_area_level_1")
        ).long_name;
        const state = addressArray.find(
          (elem) => elem.types[0] === "administrative_area_level_1"
        ).long_name;
        const address = {
          address: res.results[0].formatted_address,
          city,
          state,
          lat: newLat,
          lng: newLng,
        };
        setStart(address);
        setFromInput(address.address);
      });
    };

    return (
      <GoogleMap defaultZoom={15} center={start}>
        <Marker position={start} draggable={true} onDragEnd={onMarkerDragEnd}>
          <InfoWindow>
            <div>{start.address ? start.address : "You are here"}</div>
          </InfoWindow>
        </Marker>
        <LocationInput
          type="text"
          ref={refInput}
          name="start"
          placeholder="Where to start"
          value={fromInput}
          onChange={(e) => setFromInput(e.target.value)}
        />
        <LocationInput
          type="text"
          ref={refInputDest}
          name="end"
          placeholder="Where to go"
          value={toInput}
          onChange={(e) => setToInput(e.target.value)}
        />
        {direction && <DirectionsRenderer directions={direction} />}
      </GoogleMap>
    );
  })
);

const LocationInput = styled.input`
  width: 100%;
  height: 40px;
  padding-left: 16px;
  margin-top: 2px;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 0 10px 1px lightgrey;
  border: none;

  &:focus {
    outline: none;
  }
`;

export default function Map() {
  return (
    <MapWithAMarker
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `600px`, marginTop: "10px" }} />}
      mapElement={<div style={{ height: `100%`, marginBottom: "10px" }} />}
    />
  );
}
