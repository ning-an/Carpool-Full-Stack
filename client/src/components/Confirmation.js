import React from "react";
import { useParams } from "react-router-dom";

export default function Tracking() {
  const { _id } = useParams();
  return <div>confirmation</div>;
}
