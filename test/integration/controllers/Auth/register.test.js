const { createConnection } = require('typeorm');
const { User } = require('../../../../models');
const app = require('../../../../app');
const userProvider = require('../../../fixtures/user');
const currenciesProvider = require('../../../fixtures/currency');
const { createDbRecord } = require('../../../utils');

describe('user registration test suite', () => {
    let connection;
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
    });

    beforeEach(async () => {
        await User.delete({});
    });

    describe('#POST /api/auth/register', () => {
        it('should return status 200 on successful registration', async () => {
            const user = userProvider.getRecord();

            const currencies = currenciesProvider.getRecords();
            await createDbRecord('currency', currencies);

            const res = await chai.request(app)
                .post('/api/auth/register')
                .send({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    password: user.password,
                    password_confirm: user.password
                });

            expect(res).to.have.status(200);
        });

        it('should return json result with user details on success', async () => {
            const user = userProvider.getRecord();

            const currencies = currenciesProvider.getRecords();
            await createDbRecord('currency', currencies);

            const res = await chai.request(app)
                .post('/api/auth/register')
                .send({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    password: user.password,
                    password_confirm: user.password
                });

            const userResult = res.body.user;
            expect(userResult).to.be.a('object');
            expect(userResult).to.have.property('firstName');
            expect(userResult.firstName).to.be.a('string');
            expect(userResult.firstName).to.not.equal('');

            expect(userResult).to.have.property('lastName');
            expect(userResult.lastName).to.be.a('string');
            expect(userResult.lastName).to.not.equal('');

            expect(userResult).to.have.property('emailAddress');
            expect(userResult.emailAddress).to.be.a('string');
            expect(userResult.emailAddress).to.not.equal('');

            expect(userResult).to.have.property('token');
            expect(userResult.token).to.be.a('string');
            expect(userResult.token).to.not.equal('');

        });

        it('should return 400 on missing or invalid parameters', () => {
            const user = userProvider.getRecord();

            const req = chai.request(app).keepOpen();

            Promise.all([
                req.post('/api/auth/register').send({
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    password: user.password,
                    password_confirm: user.password
                }),
                req.post('/api/auth/register').send({
                    firstName: user.firstName,
                    emailAddress: user.emailAddress,
                    password: user.password,
                    password_confirm: user.password
                }),
                req.post('/api/auth/register').send({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: user.password,
                    password_confirm: user.password
                }),
                req.post('/api/auth/register').send({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    password_confirm: user.password
                }),
                req.post('/api/auth/register').send({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    password: user.password,
                }),
            ])
                .then(responses => {
                    expect(responses[0]).to.have.status(400);
                    expect(responses[1]).to.have.status(400);
                    expect(responses[2]).to.have.status(400);
                    expect(responses[3]).to.have.status(400);
                    expect(responses[4]).to.have.status(400);
                })
                .then(() => { req.close() });
        });

    });

    after(async () => {
        await connection.close();
    });
});