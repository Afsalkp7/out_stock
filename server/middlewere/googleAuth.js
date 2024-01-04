const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const userCollection = require("../model/userModel");
require("dotenv").config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3900/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const existingUser = await userCollection.findOne({
        googleId: profile.id,
      });
      if (existingUser) {
        return done(null, existingUser);
      }
      const userData = new userCollection({
        userName: profile.displayName,
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        status: "Active",
      });
      await userData.save();
      done(null, userData);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  if (user) {
    done(null, user);
  } else {
    done(new Error("User not found"));
  }
});
