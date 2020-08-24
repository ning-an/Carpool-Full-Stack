const { MongoClient } = require("mongodb");
require("dotenv").config();
const assert = require("assert");
const bcrypt = require("bcrypt");

// User model
const User = require("../models/User");

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
      req.flash("success_msg", "You are now registered and can log in");
      res.status(201).json({ msg: req.flash("success_msg") });
    }
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const getUserByEmail = async (email) => {
  const client = await MongoClient(MONGO_URI, optiosn);
  await client.connect();
  const db = client.db("vroom");
  const user = await db.collection("users").findOne({ email });
  client.close();
  return user;
};

const getUserById = async (_id) => {
  const client = await MongoClient(MONGO_URI, optiosn);
  await client.connect();
  const db = client.db("vroom");
  const user = await db.collection("users").findOne({ _id });
  client.close();
  return user;
};
module.exports = { createUser, getUserByEmail, getUserById };
