'use strict';

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user-model');


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});


passport.use(new FacebookStrategy({
    clientID : '726299461081972',
    clientSecret : '885564d2978b946225fee5e9da8ad3e9',
    profileFields : ['email', 'displayName', 'photos'],
    passReqToCallback : true,
    callbackURL : '/auth/facebook/callback'
}, function(req, token, refreshToken, profile,done) {
    User.findOne({facebook : profile.id}, function(err, user){
        if(err) {
            return done(err);
        }
        if(user) {
            return done(null, user);
        }
        const newUser = new User();
        newUser.facebook = profile.id;
        newUser.fullname = profile.displayName;
        newUser.email = profile._json.email;
        newUser.profilePhoto = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
        newUser.fbTokens.push({token : token});
        newUser.save(function(err){
            if(err)     return done(err);
            return done(null, newUser);
        });
    });
}));