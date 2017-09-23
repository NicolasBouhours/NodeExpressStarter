const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../server/models/User');
const config = require('./config');

// Setup work and export for the JWT passport strategy
const PassportConfig = (passport) => {
  let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
  };

  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({
        id: jwt_payload.id
      });

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch(error) {
      return done(err, false);
    }
  }));
};

module.exports = PassportConfig;
