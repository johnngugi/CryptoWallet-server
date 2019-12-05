const EntitySchema = require('typeorm').EntitySchema;
const { Currency } = require('../models/Currency');

module.exports = new EntitySchema({
    name: 'currency',
    target: Currency,
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
        },
        shortName: {
            type: 'varchar',
            nullable: true
        },
    },
    // relations: {
    //     wallet: {
    //         target: 'wallet',
    //         type: 'one-to-many',
    //         joinTable: true,
    //         cascade: true
    //     },
    // }
});