var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
    // Passport session setup
    // 1. Used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // 2. Used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Local signup
    passport.use('local-signup', new LocalStrategy({
        // Override username with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({email: email}, function(err, user) {
            if(err) return done(err);
            if(user) return done(null, false, req.flash('errorMessage', '<strong>Dang!</strong> The email is already registered'));

            // Add new user!
            var newUser = new User();
            newUser.email = email;
            newUser.active = true;
            newUser.username = req.body.username;
            newUser.password = newUser.generateHash(password);
            newUser.dateAdded = Date();
            newUser.things = [];
            newUser.friends = [];

            newUser.save(function(err) {
                if(err) throw err;
                return done(null, newUser);
            });
        });
    }));

    // Local login
    passport.use('local-login', new LocalStrategy({
        // Override username with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({email: email}, function(err, user) {
            if(err) return done(err);
            if(!user) return done(null, false, req.flash('errorMessage', '<strong>Snap!</strong> The email is not registered'));
            if(!user.validPassword(password)) return done(null, false, req.flash('errorMessage', '<strong>Oops!</strong> Wrong password'));

            // Yes!
            return done(null, user);
        });
    }));
};