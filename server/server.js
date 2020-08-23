const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// User register and login
app.use("/users", require("./routes/users"));

// Listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
