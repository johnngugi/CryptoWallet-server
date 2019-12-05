const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authentication } = require('../config');
const ethereum = require('../currencies/ethereum');

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign({ id: user.id, email: user.emailAddress }, authentication.JWT_SECRET, {
        expiresIn: ONE_WEEK
    });
}

function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

function hashPassword(user) {
    const saltRounds = 10;
    return bcrypt.hash(user.password, saltRounds);
}

module.exports = {
    async register(req, res) {

        const user = new User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.emailAddress = req.body.emailAddress;
        user.password = req.body.password;

        const hashedPassword = await hashPassword(user);
        user.password = hashedPassword;

        let result;
        try {
            result = await user.save();
        } catch (error) {
            switch (error.code) {
                case 'ER_DUP_ENTRY':
                    return res.status(500).send({ error: 'Email already exists' });
                default:
                    console.error(error);
                    return res.status(500).send('Server error');
            }
        }

        try {
            ethereum.createWallet(result);
        } catch (error) {
            // TODO: log errors instead of printing
            console.error(error);
        }

        const token = jwtSignUser(user);
        let userResult = {
            firstName: result.firstName,
            lastName: result.lastName,
            emailAddress: result.emailAddress,
            token
        }
        res.send(userResult);
    },


    async login(req, res) {
        try {
            const { emailAddress, password } = req.body;
            const user = await User.findOne({ emailAddress });

            if (!user) {
                res.status(403).send({
                    error: 'Incorrect login information'
                });
                return;
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(403).send({
                    error: 'Incorrect login information'
                });
            }

            const token = jwtSignUser(user);
            let userResult = {
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                token
            }

            return res.send({
                user: userResult,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                error: 'Error occured while logging in'
            })
        }
    }
}