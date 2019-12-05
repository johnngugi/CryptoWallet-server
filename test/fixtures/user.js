const _ = require('lodash');
const Chance = require('chance');

const getRecord = (overrides = {}, qty = 1) => {
    var chance = new Chance();
    const records = _.times(qty, () => {
        const {
            firstName = chance.first(),
            lastName = chance.last(),
            emailAddress = chance.email(),
            password = chance.word()
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