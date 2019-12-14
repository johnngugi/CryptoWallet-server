const EntitySchema = require('typeorm').EntitySchema;
const { Wallet } = require('../models/Wallet');
// eslint-disable-next-line no-unused-vars
const { Currency } = require('../models/Currency');
// eslint-disable-next-line no-unused-vars
const { User } = require('../models/User');

module.exports = new EntitySchema({
    name: 'wallet',
    target: Wallet,
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        address: {
            type: 'varchar',
        },
        encryptedKey: {
            type: 'varchar'
        },
    },
    relations: {
        currency: {
            target: 'Currency',
            type: 'many-to-one',
            joinColumn: {
                name: 'currency',
                referencedColumnName: 'id'
            },
            cascade: true,
            // onDelete: "CASCADE"
        },
        user: {
            target: 'User',
            joinColumn: {
                name: 'user',
                referencedColumnName: 'id'
            },
            type: 'many-to-one',
            cascade: true,
            // onDelete: "CASCADE"
        },
    }
});