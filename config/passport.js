const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../api/models/user');
const Admin = require('../api/models/admin');
const config = require('./database');

module.exports.user = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload._doc._id, (err, user) => {
      if(err){
        return done(err, false);
      }
      if(user){
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}

//for admin

module.exports.admin = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    Admin.getUserById(jwt_payload._doc._id, (err, admin) => {
      if(err){
        return done(err, false);
      }
      if(user){
        return done(null, admin);
      } else {
        return done(null, false);
      }
    });
  }));
}