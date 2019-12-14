const passport = require('passport');
const { User } = require('../models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { authentication } = require('../config');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: authentication.JWT_SECRET
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await User.findOne({ id: jwt_payload.id, email: jwt_payload.email });

        if (!user) {
            return done(new Error(), false);
        }

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = null;