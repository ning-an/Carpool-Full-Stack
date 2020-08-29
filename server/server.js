const express = require("express");
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");

const { checkAuthenticated, createTrip } = require("./routes/routesHelpers");

const app = express();

const PORT = process.env.PORT;

// Passport config
require("./config/passport")(passport);

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

// User register and login
app.use("/users", require("./routes/users"));

// Dashboard
app.get("/dashboard", checkAuthenticated, (req, res) => {
  res.send(req.user.name);
});

// Trips
app.post("/trips", createTrip);

// Listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
