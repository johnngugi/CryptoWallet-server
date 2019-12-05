const EntitySchema = require('typeorm').EntitySchema;
const { User } = require('../models/User');

module.exports = new EntitySchema({
    name: 'user',
    target: User,
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        firstName: {
            type: 'varchar',
        },
        lastName: {
            type: 'varchar'
        },
        emailAddress: {
            type: 'varchar',
            length: 200,
            unique: true,
        },
        password: {
            type: 'varchar',
        }
    },
});