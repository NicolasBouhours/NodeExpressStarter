const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../server/models/user');
const config = require('./config');

// Setup work and export for the JWT passport strategy
const PassportConfig = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
  };

  passport.use(new Strategy(opts, async (JWT_PAYLOAD, done) => {
    try {
      const user = await User.findOne({
        id: JWT_PAYLOAD.id
      });

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));
};

module.exports = PassportConfig;
