const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const assert = require("assert");
const bcrypt = require("bcrypt");

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

const getUserById = async (_id) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("vroom");
  const user = await db.collection("users").findOne(ObjectId(_id));
  client.close();
  return user;
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
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    const user = await db
      .collection("trips")
      .insertOne({ userId: _id, ...trip });
    client.close();
    res.status(201).json({ status: 201, msg: "Trip posted" });
  } catch (e) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  checkAuthenticated,
  checkNotAuthenticated,
  createTrip,
};
