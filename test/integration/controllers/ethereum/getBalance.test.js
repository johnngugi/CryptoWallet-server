const { createConnection } = require('typeorm');
const sinon = require('sinon');
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

describe('Ethereum get balance controller', () => {
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
        let token = results[1].body.user.token;
        bearerToken = `Bearer ${token}`;
        await connection.query('PRAGMA foreign_keys=ON');
    });

    after(async () => {
        await connection.close();
    });

    beforeEach(() => {
        this.web3 = sinon.stub(web3.eth, 'getBalance').resolves('1000000000000');
    });

    afterEach(() => {
        this.web3.restore();
    });

    describe('#GET /api/eth/balance', () => {

        it('should respond with status 200 on successful request', async () => {
            const res = await chai.request(app)
                .get('/api/eth/balance')
                .set('Authorization', bearerToken);

            expect(res).to.have.status(200);
        });

        it('should respond with 403 when unauthorized', async () => {
            const res = await chai.request(app)
                .get('/api/eth/balance');

            expect(res).to.have.status(403);
        });

        it('should respond with json object on successful request', async () => {
            const res = await chai.request(app)
                .get('/api/eth/balance')
                .set('Authorization', bearerToken);

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