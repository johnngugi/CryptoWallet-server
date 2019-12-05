const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authentication } = require('../config');

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign({ id: user.id, email: user.emailAddress }, authentication.JWT_SECRET, {
        expiresIn: ONE_WEEK
    });
}

function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

module.exports = {
    authentication: {
        jwtSignUser
    },
    passwords: {
        comparePassword,
        hashPassword
    }
};