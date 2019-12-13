const _ = require('lodash');
const Chance = require('chance');

const getRecord = (overrides = {}, qty = 1) => {
    var chance = new Chance();
    const records = _.times(qty, () => {
        const {
            address = '0xa45C6d521BaEE7C0fDfEA932a3Cca5f537410d43',
            encryptedKey = '{"id": "ed1eb481-ee91-4837-a6fc-824f904334ab",\
                             "crypto": {\
                                "kdf": "scrypt",\
                                "mac": "c5bc675c1d533794fc1e6d86beab88ed648ef37b626356380f31e8397b11fc11",\
                                "cipher": "aes-128-ctr",\
                                "kdfparams": {\
                                    "n": 8192,\
                                    "p": 1,\
                                    "r": 8,\
                                    "salt": "4f5c77260e5731e7b7f34a34ad9d18a84b9609aba51cb6a5ec40a08f918a7b00",\
                                    "dklen": 32\
                                },\
                                "ciphertext": "ab0f9a81073e0f66408dda531391ee2a7cb2d2cc2ead487c85c7d0b8da04226a",\
                                "cipherparams": {\
                                    "iv": "5711da7df4bb3fec29786fe19b143aca"\
                                }\
                            },\
                            "address": "ff4de29fb23226b7d2884b56dd5276f49bd87a94",\
                            "version": 3\
                        }',
            currency = chance.integer({ min: 1, max: 20 }),
            user = chance.integer({ min: 1, max: 20 }),
        } = overrides;

        return {
            address,
            encryptedKey,
            currency,
            user
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