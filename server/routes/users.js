const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const flash = requrie("express-flash");
const session = require("express-session");
require("dotenv").config();

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const { createUser } = require("./routesHelpers");
const initializePassport = require("../passport-config");

initializePassport(passport);
// Register
router.post("/register", createUser);

// Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
module.exports = router;
