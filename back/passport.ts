import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

// This "Strategy" tells Passport how to handle Google Login
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "http://localhost:3001/auth/google/callback", // Must match Google Console exactly
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Logic for your database goes here:
      // const user = await User.findOrCreate({ googleId: profile.id });
      
      // For now, we just pass the profile through
      return done(null, profile);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// These two are REQUIRED to keep the user logged in via sessions
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});