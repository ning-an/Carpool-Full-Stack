const express = require("express");
const router = express.Router();
const passport = require("passport");
require("dotenv").config();

const { createUser, checkNotAuthenticated } = require("./routesHelpers");

// Register
router.post("/register", checkNotAuthenticated, createUser);
// router.get("/register", checkNotAuthenticated, (req, res) => {
//   res.send("okay");
// });

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(400).json(info);
    } else {
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.status(200).json(user);
      });
    }
  })(req, res, next);
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.status(200).json({ status: 200 });
});

// Logout
router.delete("/logout", (req, res) => {
  req.logOut();
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.status(200).json({ msg: "You are logged out" });
  });
  // req.session.destroy();
});

module.exports = router;
