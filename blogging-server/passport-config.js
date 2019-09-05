var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
var User = require("./models/user");

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "userName",
      passwordField: "password"
    },
    function(username, password, done) {
      User.findOne({ userName: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user || !user.isValid(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
