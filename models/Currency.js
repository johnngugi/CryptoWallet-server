const BaseEntity = require('typeorm').BaseEntity;

class Currency extends BaseEntity {
    constructor(id, name, shortName) {
        super();
        this.id = id;
        this.name = name;
        this.shortName = shortName;
    }
}

module.exports = {
    Currency
};