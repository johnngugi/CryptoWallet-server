var { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = require('./config');

module.exports = {
    'name': 'default',
    'type': 'mysql',
    'host': `${DB_HOST}`,
    'port': `${DB_PORT}`,
    'username': `${DB_USER}`,
    'password': `${DB_PASS}`,
    'database': `${DB_NAME}`,
    'entities': [
        __dirname + '/entities/index.js'
    ],
    'migrations': [
        'migrations/*.js'
    ],
    'cli': {
        'migrationsDir': 'migrations'
    }
}