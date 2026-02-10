import { Profile } from 'passport-google-oauth20';

declare global {
  namespace Express {
    interface User extends Profile {} // This tells TS that req.user is a Google Profile
  }
}