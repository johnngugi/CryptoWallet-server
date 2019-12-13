const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../../.env' });

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    authentication: {
        JWT_SECRET: process.env.JWT_SECRET
    },
    ethereum: {
        INFURA_ACCESS_TOKEN: process.env.INFURA_ACCESS_TOKEN
    }
}