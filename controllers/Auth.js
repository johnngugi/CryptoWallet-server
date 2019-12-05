const { User } = require('../models/User');
const ethereum = require('../currencies/ethereum');
const { authentication, passwords } = require('../utils');

module.exports = {
    async register(req, res) {

        const user = new User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.emailAddress = req.body.emailAddress;
        user.password = req.body.password;

        const hashedPassword = await passwords.hashPassword(user.password);
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

        const token = authentication.jwtSignUser(user);
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

            const isPasswordValid = await passwords.comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(403).send({
                    error: 'Incorrect login information'
                });
            }

            const token = authentication.jwtSignUser(user);
            let userResult = {
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                token
            }

            return res.send({
                userResult,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                error: 'Error occured while logging in'
            })
        }
    }
}