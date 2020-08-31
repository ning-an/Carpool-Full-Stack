const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { getUserByEmail, getDataById } = require("../routes/routesHelpers");

const initialize = (passport) => {
  const authenticateUser = async (email, password, done) => {
    // Match user
    const user = await getUserByEmail(email); // return a user if it exists
    if (!user) {
      return done(null, false, { msg: "That email is not registered" });
    }

    // Match password
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { msg: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await getDataById("users", id);
    return done(null, user);
  });
};

module.exports = initialize;
