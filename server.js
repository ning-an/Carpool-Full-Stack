const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");

const app = express();

const PORT = process.env.PORT || 5000;

// Passport config
require("./server/config/passport")(passport);

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

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "server")));

// User register and login
app.use("/api/users", require("./server/routes/users"));

// Trips
app.use("/api/trips", require("./server/routes/trips"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
