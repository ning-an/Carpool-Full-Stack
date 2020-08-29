import React from "react";
import { useHistory } from "react-router-dom";

import Map from "./map";
import TripForm from "./TripForm";

export default function Home() {
  const history = useHistory();
  // fetch("/dashboard").then((res) => {
  //   if (!res.ok) {
  //     history.push("/users/login");
  //   }
  // });

  return (
    <div>
      <Map />
      <TripForm />
    </div>
  );
}
