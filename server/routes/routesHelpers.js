const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const assert = require("assert");
const bcrypt = require("bcrypt");
const moment = require("moment");

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    // Validate with DB
    const user = await db.collection("users").findOne({ email });
    if (user) {
      // user exists
      throw new Error("Email is already registered");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        ...req.body,
        password: hashedPassword,
      };
      const r = await db.collection("users").insertOne(newUser);
      assert.equal(1, r.insertedCount);
      client.close();
      res.status(201).json({ msg: "You are now registered and can log in" });
    }
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const getUserByEmail = async (email) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("vroom");
  const user = await db.collection("users").findOne({ email });
  client.close();
  return user;
};

const getDataById = async (collection, _id) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("vroom");
  const data = await db.collection(collection).findOne(ObjectId(_id));
  client.close();
  return data;
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(404).json({ msg: "Please log in to post your trip" });
};

const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(404).json(req.user);
  }
  next();
};

const createTrip = async (req, res) => {
  const { _id } = req.user;
  const trip = req.body;
  let tripId;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    const response = await db.collection("trips").insertOne({
      userId: _id,
      ...trip,
      status: "idle",
      invite: [],
      match: [],
    });
    tripId = response.insertedId;
    client.close();
    res.status(201).json({ _id: tripId });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getCurrentTripInfo = async (req, res) => {
  const { _id } = req.params;
  try {
    const trip = await getDataById("trips", _id);
    res.status(200).json({ trip });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const getTripsForCurrentUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    const trips = await db
      .collection("trips")
      .find({ userId: ObjectId(userId) })
      .toArray();
    client.close();
    res.status(200).json({ trips });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const findMatchedTrips = async (req, res) => {
  const { _id } = req.params;
  try {
    const {
      origin: { city: originCity },
      destination: { city: destinationCity },
      earlySchedule,
      lateSchedule,
      beDriver,
      seats,
    } = await getDataById("trips", _id);
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    const dbTrips = await db
      .collection("trips")
      .find({
        "origin.city": originCity,
        "destination.city": destinationCity,
        beDriver: !beDriver,
      })
      .toArray();
    client.close();
    // Validate if a trip matched
    const isMatched = (trip) => {
      // filter history trips by status and those already matched with other driver
      if (
        trip.status === "fulfilled" ||
        trip.status === "cancelled" ||
        (trip.status === "matched" && !trip.match.includes(_id))
      ) {
        return false;
      }
      // time not match
      if (
        moment(trip.earlySchedule).isAfter(moment(lateSchedule)) ||
        moment(trip.lateSchedule).isBefore(moment(earlySchedule))
      ) {
        return false;
      }
      // passengers need more seats than drivers can offer
      if (
        (!beDriver && seats > trip.seats) ||
        (beDriver && seats < trip.seats)
      ) {
        return false;
      }
      return true;
    };
    const matchedTrips = dbTrips.filter(isMatched);
    res.status(200).json({ matchedTrips });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

const cancelInvitation = async (req, res) => {
  const { _id } = req.params;
  const { matchedTrip_id } = req.body;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    await db
      .collection("trips")
      .updateOne({ _id: ObjectId(_id) }, { $pull: { invite: matchedTrip_id } });
    await db
      .collection("trips")
      .updateOne({ _id: ObjectId(matchedTrip_id) }, { $pull: { invite: _id } });
    client.close();
    res.status(200).json({ msg: "Invitation cancelled" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const addInvitation = async (req, res) => {
  const { _id } = req.params;
  const { matchedTrip_id } = req.body;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    await db
      .collection("trips")
      .updateOne({ _id: ObjectId(_id) }, { $push: { invite: matchedTrip_id } });
    await db
      .collection("trips")
      .updateOne({ _id: ObjectId(matchedTrip_id) }, { $push: { invite: _id } });
    client.close();
    res.status(200).json({ msg: "Invitation sent" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const pickPassenger = async (req, res) => {
  const { _id } = req.params;
  const { matchedTrip_id, seats, status } = req.body;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    await db.collection("trips").updateOne(
      { _id: ObjectId(_id) },
      {
        $push: { match: matchedTrip_id },
        $inc: { seats: -seats },
        $set: { status },
      }
    );
    await db
      .collection("trips")
      .updateOne(
        { _id: ObjectId(matchedTrip_id) },
        { $push: { match: _id }, $set: { status: "matched" } }
      );
    client.close();
    res.status(200).json({ msg: "Passenger picked" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const cancelPick = async (req, res) => {
  const { _id } = req.params;
  const { matchedTrip_id, seats, status } = req.body;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    await db.collection("trips").updateOne(
      { _id: ObjectId(_id) },
      {
        $pull: { match: matchedTrip_id },
        $inc: { seats: seats },
        $set: { status },
      }
    );
    await db
      .collection("trips")
      .updateOne(
        { _id: ObjectId(matchedTrip_id) },
        { $pull: { match: _id }, $set: { status: "idle" } }
      );
    client.close();
    res.status(200).json({ msg: "Pick cancelled" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const cancelPostedTrip = async (req, res) => {
  const { _id } = req.params;
  const { invite, match } = req.body;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    await db.collection("trips").updateOne(
      { _id: ObjectId(_id) },
      {
        $set: { status: "cancelled", invite: [], match: [] },
      }
    );
    if (invite.length > 0) {
      for (const trip of invite) {
        await db
          .collection("trips")
          .updateOne({ _id: ObjectId(trip) }, { $pull: { invite: _id } });
      }
    }
    if (match.length > 0) {
      for (const trip of match) {
        await db
          .collection("trips")
          .updateOne(
            { _id: ObjectId(trip) },
            { $pull: { match: _id }, $set: { status: "idle" } }
          );
      }
    }
    client.close();
    res.status(200).json({ msg: "Trip cancelled" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getDataById,
  checkAuthenticated,
  checkNotAuthenticated,
  createTrip,
  getCurrentTripInfo,
  findMatchedTrips,
  cancelInvitation,
  addInvitation,
  pickPassenger,
  cancelPick,
  getTripsForCurrentUser,
  cancelPostedTrip,
};
