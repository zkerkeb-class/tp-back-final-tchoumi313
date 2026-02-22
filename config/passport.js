import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { CONFIG } from "./constants.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || CONFIG.BACKEND_URL}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // Build a lean user object from the Google profile
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
      };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
