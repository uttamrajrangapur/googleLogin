const express = require('express')
const app = express()
app.use(express.static('public'))

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
app.use(passport.initialize());
app.use(passport.session());

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: "143346678696-ncil93oc1hd1dsklr5dph31uc5t90an1.apps.googleusercontent.com",
    clientSecret: "9r1TwjhC8Z3-Sx5NXcac3Ccu",
    callbackURL: "https://4329d814e07b.ngrok.io/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("creating the user in the database...");
      console.log(JSON.stringify({ name: profile.name }));
      return done(null, profile);
      //  User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //    return done(err, user);
      //  });
  }
));
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h2>Welcome screen!!</h2>');
  });
app.listen(3000);