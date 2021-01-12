
'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const User = require('../models/user-model');

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: '704670818547-56ltcjvnfc3vu0hfmrqim0et3dkrsv9b.apps.googleusercontent.com',
  clientSecret: 'a5mzbqi_LCzVnlZB8QiYee19',
  passReqToCallback : true,
  callbackURL : 'http://localhost:3000/auth/google/callback'
},function(req, accessToken, refreshToken, profile, done){
    User.findOne({google : profile.id}, function(err, user) {
      if(err) {
        return done(err);
      }
      if(user) {
        return done(null, user);
      }
      const newUser = new User();
      newUser.google = profile.id;
      newUser.fullname = profile.displayName;
      newUser.email = profile.emails[0].value;
      newUser.profilePhoto = profile._json.picture;
      newUser.save(function(err){
        console.log(err);
        return done(null, newUser);
      });
    });
}));
