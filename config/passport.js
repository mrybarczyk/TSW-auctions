const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const key = require('./keys').secret;
const bcrypt = require('bcryptjs');

module.exports = passport => {
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ 'username': username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, isValid) => {
                if (err) return done(err);
                if (!isValid) return done(null, false);
                return done(null, user);
              })
            })
          }
        ))
        passport.serializeUser(function(user, done) {
            done(null, {
               id: user._id,
               username: user.username,
               name: user.name,
               email: user.email
            });
         });
         
         passport.deserializeUser(function(obj, done) {
            done(null, obj);
         });
};