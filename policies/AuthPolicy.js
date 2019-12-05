const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');


module.exports = {
    register(req, res, next) {
        const schema = Joi.object({
            firstName: Joi.string().alphanum().min(3).max(30).required(),
            lastName: Joi.string().alphanum().min(3).max(30).required(),
            emailAddress: Joi.string().email(),
            password: new PasswordComplexity(),
            password_confirm: Joi.ref('password'),
        })
            .with('password', 'password_confirm');

        const { error } = Joi.validate(req.body, schema);

        if (error) {
            switch (error.details[0].context.key) {
                case 'firstName':
                    return res.status(400).send({
                        error: `field firstName must contain only alpha numeric charachters, minimum length of 3 and maximum length of 30`
                    });
                case 'lastName':
                    return res.status(400).send({
                        error: `field lastName must contain only alpha numeric charachters, minimum length of 3 and maximum length of 30`
                    });
                case 'emailAddress':
                    return res.status(400).send({ error: 'Invalid email' });
                case 'password':
                    if (error.details[0].context.peer) {
                        return res.status(400).send({
                            error: `Please provide confirmation password`
                        });
                    }
                    return res.status(400).send({
                        error: `Password must contain at least 8 charachters and at most 26 charachters, at least one lowercase and uppercase charachter, at least one number and at least one symbol`
                    });
                case 'password_confirm':
                    return res.status(400).send({
                        error: 'Passwords don\'t match'
                    });
                default:
                    return res.status(400).send({ error: 'invalid registration information' });
            }
        } else {
            next();
        }
    }
}