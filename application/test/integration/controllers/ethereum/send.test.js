const { createConnection } = require('typeorm');
const sinon = require('sinon');
const axios = require('axios');
const passport = require('passport');
const { currenciesProvider, userProvider } = require('../../../fixtures');
const { web3, createWallet } = require('../../../../currencies/ethereum');
const { createDbRecord } = require('../../../utils');

describe('Ethereum send ethereum controller', () => {

    let connection;
    let user;
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

        user = userProvider.getRecord({ id: 1 });
        const currencies = currenciesProvider.getRecords();
        await Promise.all([
            createDbRecord('currency', currencies),
            createDbRecord('user', user),
        ]);
        await createWallet(user);
        await connection.query('PRAGMA foreign_keys=ON');
    });

    after(async () => {
        await connection.close();
    });

    beforeEach(() => {
        sinon.stub(passport, 'authenticate').callsFake((strategy, callback) => {
            callback(null, user);
            return () => { };
        });
        this.gasPrices = sinon.stub(axios, 'get').resolves({
            data: {
                safeLow: 10,
                average: 31,
                fast: 100
            }
        });
        this.getBalance = sinon.stub(web3.eth, 'getBalance').resolves('50000000000000000');
        this.transactionCount = sinon.stub(web3.eth, 'getTransactionCount').resolves(0);
        this.sendSignedTransaction = sinon.stub(web3.eth, 'sendSignedTransaction').
            resolves('0x######################');
    });

    afterEach(() => {
        passport.authenticate.restore();
        this.getBalance.restore();
        this.transactionCount.restore();
        this.sendSignedTransaction.restore();
        this.gasPrices.restore();
    });

    describe('#POST /api/eth/send', () => {

        it('should respond with status 200 on success', async () => {
            const res = await chai.request(app)
                .post('/api/eth/send')
                .send({
                    value: '0.01',
                    to: '0xa45C6d521BaEE7C0fDfEA932a3Cca5f537410d43'
                });

            expect(res).to.have.status(200);
        });

        it('should respond with status 403 if unauthorized', async () => {
            passport.authenticate.restore();
            sinon.stub(passport, 'authenticate').callsFake((strategy, callback) => {
                callback(new Error('unauthenticated'), null);
                return () => { };
            });

            const res = await chai.request(app)
                .post('/api/eth/send')
                .send({
                    value: '10',
                    to: '0xa45C6d521BaEE7C0fDfEA932a3Cca5f537410d43'
                });

            expect(res).to.have.status(403);
        });

        it('should respond with 400 for missing or wrong request data', async () => {
            const req = chai.request(app).keepOpen();

            const responses = await Promise.all([
                req.post('/api/eth/send'),
                req.post('/api/eth/send').send({ value: '0.01' }),
                req.post('/api/eth/send').send({ to: '0xa45C6d521BaEE7C0fDfEA932a3Cca5f537410d43' }),
                req.post('/api/eth/send').send({ to: '0xa45' })
            ]);

            expect(responses[0]).to.have.status(400);
            expect(responses[1]).to.have.status(400);
            expect(responses[2]).to.have.status(400);
            req.close();
        });

    });

});