const express = require("express");
const router = express.Router();
const passport = require("passport");
// const session = require("express-session");
require("dotenv").config();

const { createUser } = require("./routesHelpers");
// const initializePassport = require("../passport-config");

// initializePassport(passport);
// Register
router.post("/register", createUser);

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});
module.exports = router;
