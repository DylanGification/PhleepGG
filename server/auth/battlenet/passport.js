var passport = require('passport');
var BnetStrategy = require('passport-bnet').Strategy;
var BNET_ID = process.env.BNET_ID;
var BNET_SECRET = process.env.BNET_SECRET;

// Use the BnetStrategy within Passport.
passport.use(new BnetStrategy({
    clientID: config.bnet.clientID,
    clientSecret: config.bnet.clientSecret,
    callbackURL: config.bnet.callbackURL,
    region: "eu"
}, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));
