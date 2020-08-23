const { MongoClient } = require("mongodb");
require("dotenv").config();
const assert = require("assert");
const bcrypt = require("bcrypt");

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createUser = async (req, res) => {
  const { password } = req.body;
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      ...req.body,
      password: hashedPassword,
    };
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("vroom");
    const r = await db.collection("users").insertOne(newUser);
    assert.equal(1, r.insertedCount);
    client.close();
    res.status(201).send("success");
    console.log(newUser);
  } catch (err) {
    res.status(400).json({ status: 400, msg: err.message });
  }
};

module.exports = { createUser };
