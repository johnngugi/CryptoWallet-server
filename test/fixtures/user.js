const _ = require('lodash');
const Chance = require('chance');

const getRecord = (overrides = {}, qty = 1) => {
    var chance = new Chance();
    const records = _.times(qty, () => {
        const {
            firstName = chance.first(),
            lastName = chance.last(),
            emailAddress = chance.email(),
            password = chance.string({ length: 8, alpha: true }) +
            chance.character({ symbols: true }) +
            chance.character({ numeric: true }) +
            chance.character({ casing: 'upper' }) +
            chance.character({ casing: 'lower' })
        } = overrides;

        return {
            firstName,
            lastName,
            emailAddress,
            password
        };
    });

    if (qty === 1) {
        return records[0];
    }
    return records;
};

module.exports = {
    getRecord
}