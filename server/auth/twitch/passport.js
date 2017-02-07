var passport = require('passport');
var TwitchtvStrategy = require('passport-twitch').Strategy;
var TWITCHTV_CLIENT_ID = process.env.TWITCHTV_CLIENT_ID;
var TWITCHTV_CLIENT_SECRET = process.env.TWITCHTV_CLIENT_SECRET;

passport.use(new TwitchtvStrategy({
    clientID: TWITCHTV_CLIENT_ID,
    clientSecret: TWITCHTV_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitchtv/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ twitchtvId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));