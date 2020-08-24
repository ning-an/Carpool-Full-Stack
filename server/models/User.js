const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  plate: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
});

const Passenger = mongoose.model("Passenger", PassengerSchema);
const Driver = mongoose.model("Driver", DriverSchema);

module.exports = { Passenger, Driver };
