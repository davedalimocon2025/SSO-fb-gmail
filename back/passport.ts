import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: "http://localhost:3001/auth/google/callback",
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // This will either update the existing user or create a new one
        const user = await User.findOneAndUpdate(
          { googleId: profile.id }, // search condition
          {
            $set: {
              email: profile.emails?.[0]?.value,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value
            }
          },
          {
            new: true,   // return the updated document
            upsert: true // create if not found
          }
        );

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);


passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
