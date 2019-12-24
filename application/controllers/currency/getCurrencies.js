const { Currency } = require('../../models');

module.exports = async (req, res) => {
    const currencies = await Currency.find();
    return res.send(currencies);
};