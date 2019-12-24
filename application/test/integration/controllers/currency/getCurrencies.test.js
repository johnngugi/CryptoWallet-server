const { createConnection } = require('typeorm');
const sinon = require('sinon');
const passport = require('passport');
const { currenciesProvider, userProvider } = require('../../../fixtures');
const { createDbRecord } = require('../../../utils');

describe('currency getCurrencies controller', () => {

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
        await createDbRecord('currency', currencies);
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
    });

    afterEach(() => {
        passport.authenticate.restore();
    });

    describe('#GET /api/currency', () => {
        it('should respond with status 200 on success', async () => {
            const res = await chai.request(app)
                .get('/api/currency');

            expect(res).to.have.status(200);
        });

        it('should respond with status 403 when unauthorized', async () => {
            passport.authenticate.restore();
            sinon.stub(passport, 'authenticate').callsFake((strategy, callback) => {
                callback(new Error('unauthenticated'), null);
                return () => { };
            });
            const res = await chai.request(app)
                .get('/api/currency');

            expect(res).to.have.status(403);
        });

        it('should respond with json array on successful request', async () => {
            const res = await chai.request(app)
                .get('/api/currency');

            expect(res.body).to.be.a('array');
            expect(res.body[0]).to.be.a('object');
            expect(res.body[0]).to.have.property('name');
            expect(res.body[0]).to.have.property('shortName');
        });
    });

});