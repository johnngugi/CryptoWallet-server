const { createConnection } = require('typeorm');
const sinon = require('sinon');
const passport = require('passport');
const { currenciesProvider, userProvider } = require('../../../fixtures');
const { web3, createWallet } = require('../../../../currencies/ethereum');
const { createDbRecord } = require('../../../utils');

describe('Ethereum get balance controller', () => {

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
        this.web3 = sinon.stub(web3.eth, 'getBalance').resolves('1000000000000');
    });

    afterEach(() => {
        passport.authenticate.restore();
        this.web3.restore();
    });

    describe('#GET /api/eth/balance', () => {

        it('should respond with status 200 on successful request', async () => {
            const res = await chai.request(app)
                .get('/api/eth/balance');

            expect(res).to.have.status(200);
        });

        it('should respond with 403 when unauthorized', async () => {
            passport.authenticate.restore();
            sinon.stub(passport, 'authenticate').callsFake((strategy, callback) => {
                callback(new Error('unauthenticated'), null);
                return () => { };
            });
            const res = await chai.request(app)
                .get('/api/eth/balance');

            expect(res).to.have.status(403);
        });

        it('should respond with json object on successful request', async () => {
            const res = await chai.request(app)
                .get('/api/eth/balance');

            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('currency');
            expect(res.body.currency).to.be.a('string');
            expect(res.body.currency).to.not.equal('');

            expect(res.body).to.have.property('unit');
            expect(res.body.unit).to.be.a('string');
            expect(res.body.unit).to.not.equal('');

            expect(res.body).to.have.property('balance');
            expect(res.body.balance).to.be.a('number');
            expect(res.body.balance).to.not.equal('');
            expect(res.body.balance).to.be.above(0);
        });

    });
});