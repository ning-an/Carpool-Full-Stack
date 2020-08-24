const express = require("express");
const cors = require("cors");
const flash = require("connect-flash");
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");

const app = express();

const PORT = process.env.PORT;

// Passport config
require("./passport-config")(passport);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Middelware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// User register and login
app.use("/users", require("./routes/users"));

// Listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
