const { findUserById } = require('../helpers/findExsitingUser');
require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const API_URL = process.env.API_URL;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${API_URL}/auth/google/callback`,
},
  async (accessToken, refreshToken, profile, done) => {
    // Here you'd typically find or create a user in your DB
    const user = {
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
    };

    findUserById(user);

    return done(null, user);
  }));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));