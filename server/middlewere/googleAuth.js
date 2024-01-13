const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const userCollection = require("../model/userModel");
require("dotenv").config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://outstockfurniture.world/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const existingUser = await userCollection.find({
        email: profile.emails[0].value,
      });
      if (existingUser.length>0) {
        return done(null, existingUser);
      }else{
        const userData = new userCollection({
          userName: profile.displayName,
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          status: "active",
        });
        await userData.save();
        done(null, userData);
      }
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
