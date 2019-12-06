const { createConnection } = require('typeorm');
const sinon = require('sinon');
const axios = require('axios');
const userProvider = require('../../../fixtures/user');
const currenciesProvider = require('../../../fixtures/currency');
const { web3 } = require('../../../../currencies/ethereum');
const { createDbRecord } = require('../../../utils');

const registerUser = async () => {
    const user = userProvider.getRecord();
    return chai.request(app)
        .post('/api/auth/register')
        .send({
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            password: user.password,
            password_confirm: user.password
        });
};

describe('Ethereum send ethereum controller', () => {

    let connection;
    let bearerToken;
    before(async function () {
        connection = await createConnection({
            'type': 'sqlite',
            'database': ':memory:',
            'dropSchema': true,
            'synchronize': false,
            'logging': false,
            'entities': [
                'entities/**/*.js'
            ],
        });
        await connection.query('PRAGMA foreign_keys=OFF');
        await connection.synchronize();

        const currencies = currenciesProvider.getRecords();
        let results = await Promise.all([createDbRecord('currency', currencies), registerUser()]);
        const token = results[1].body.user.token;
        bearerToken = `Bearer ${token}`;
        await connection.query('PRAGMA foreign_keys=ON');
    });

    after(async () => {
        await connection.close();
    });

    beforeEach(() => {
        this.gasPrices = sinon.stub(axios, 'get').resolves({
            data: {
                safeLow: 10,
                average: 31,
                fast: 100
            }
        });
        this.getBalance = sinon.stub(web3.eth, 'getBalance').resolves('1000000000000');
        this.transactionCount = sinon.stub(web3.eth, 'getTransactionCount').resolves(0);
        this.sendSignedTransaction = sinon.stub(web3.eth, 'sendSignedTransaction').
            resolves('0x######################');
    });

    afterEach(() => {
        this.getBalance.restore();
        this.sendSignedTransaction.restore();
        this.gasPrices.restore();
    });

    describe('#POST /api/eth/send', () => {

        it('should respond with status 200 on success', async () => {
            const res = await chai.request(app)
                .post('/api/eth/send')
                .set('Authorization', bearerToken)
                .send({
                    currency: 'ETH',
                    value: '10',
                    to: '0xa45C6d521BaEE7C0fDfEA932a3Cca5f537410d43'
                });

            expect(res).to.have.status(200);
        });

    });

});