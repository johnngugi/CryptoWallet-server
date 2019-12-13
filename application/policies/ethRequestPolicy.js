const Joi = require('joi');
const { web3 } = require('../currencies/ethereum');

module.exports = {

    send(req, res, next) {

        const schema = Joi.object({
            to: Joi.string().required(),
            value: Joi.number().min(0).required()
        });

        const ethAddress = req.body.to;

        try {
            const { error } = Joi.validate(req.body, schema);
            if (error) {
                return res.status(400).send({
                    error: error.details[0].message
                });
            }
            const checkSumAddress = web3.utils.toChecksumAddress(ethAddress);
            req.body.to = checkSumAddress;
            req.body.value = req.body.value.toString();
            next();
        } catch (error) {
            console.error(error);
            return res.status(400).send({
                error: 'Invalid ethereum address'
            });
        }
    }

}