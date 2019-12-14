const BaseEntity = require('typeorm').BaseEntity;

class Wallet extends BaseEntity {
    constructor(id, currency, address, encryptedKey, user) {
        super();
        this.id = id;
        this.currency = currency;
        this.address = address;
        this.encryptedKey = encryptedKey;
        this.user = user;
    }
}

module.exports = {
    Wallet
}