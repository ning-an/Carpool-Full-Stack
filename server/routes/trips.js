const express = require("express");
const router = express.Router();

const {
  createTrip,
  findMatchedTrips,
  cancelInvitation,
  addInvitation,
  getCurrentTripInfo,
  pickPassenger,
  cancelPick,
} = require("./routesHelpers");

// user posts a new trip
router.post("/", createTrip);

// get targeted trip info
router.get("/:_id", getCurrentTripInfo);
// find all matched trips for the targeted trip
router.get("/matched/:_id", findMatchedTrips);

// passengers invite drivers to pick them up or cancel invitation
router.put("/addInvite/:_id", addInvitation);
router.put("/removeInvite/:_id", cancelInvitation);

// driver pick passenger or cancel pick
router.put("/addPick/:_id", pickPassenger);
router.put("/cancelPick/:_id", cancelPick);
module.exports = router;
