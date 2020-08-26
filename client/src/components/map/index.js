import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import Geocode from "react-geocode";

const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
Geocode.setApiKey(API_KEY);

const MapWithAMarker = withScriptjs(
  withGoogleMap((props) => {
    const [start, setStart] = useState({ lat: 45.5, lng: -73.56 });
    const refInput = useRef(null);

    // const getCurrentLocation = () => {

    // };

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setStart({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },

          (err) => {
            console.warn(`ERROR(${err.code}: ${err.message})`);
          }
        );
      }
    }, []);

    useEffect(() => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        refInput.current
      );

      const handlePlaceChange = () => {
        const place = autocomplete.getPlace();
        setStart({
          address: place.formatted_address,
          city: place.address_components.find(
            (elem) => elem.types[0] === "locality"
          ).long_name,
          state: place.address_components.find(
            (elem) => elem.types[0] === "administrative_area_level_1"
          ).long_name,
          lng: place.geometry.viewport.Va.i,
          lat: place.geometry.viewport.Za.i,
        });
      };
      const listener = autocomplete.addListener(
        "place_changed",
        handlePlaceChange
      );
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }, [start]);

    const onMarkerDragEnd = (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      Geocode.fromLatLng(newLat, newLng).then((res) => {
        const addressArray = res.results[0].address_components;
        const city = addressArray.find(
          (elem) => elem.types[0] === "administrative_area_level_2"
        ).long_name;
        const state = addressArray.find(
          (elem) => elem.types[0] === "administrative_area_level_1"
        ).long_name;
        setStart({
          address: res.results[0].formatted_address,
          city,
          state,
          lat: newLat,
          lng: newLng,
        });
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
          placeholder="Enter your start point"
          value={start.address}
        />
      </GoogleMap>
    );
  })
);

const LocationInput = styled.input`
  width: 100%;
  height: 40px;
  padding-left: 16px;
  margin-top: 2px;
  margin-bottom: 2em;
`;

export default function Map() {
  return (
    <MapWithAMarker
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
}
