const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const { GH_CLIENT_ID, GH_CLIENT_SECRET, SITE_URL } = process.env;

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  cb(null, id);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GH_CLIENT_ID,
      clientSecret: GH_CLIENT_SECRET,
      scope: ['user:email'],
      callbackURL: `${SITE_URL}/auth/github/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);
