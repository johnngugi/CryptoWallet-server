const { createConnection } = require('typeorm');
const app = require('../../../../app');

const userProvider = require('../../../fixtures/user');
const { passwords } = require('../../../../utils');
const { User } = require('../../../../models').User;

describe('login test suite', () => {
    before(async function () {
        let connection = await createConnection({
            'type': 'sqlite',
            'database': 'db.tests.sqlite',
            'synchronize': false,
            'logging': false,
            'entities': [
                'entities/**/*.js'
            ],
        });
        await connection.query('PRAGMA foreign_keys=OFF');
        await connection.synchronize();
        await User.delete({});
    });

    beforeEach(async () => {
        await User.delete({});
    });

    describe('#POST /api/auth/login', () => {

        it('should return status 200 on successful login', async () => {
            const user = userProvider.getRecord();
            const hashedPassword = await passwords.hashPassword(user.password);

            const testUser = new User();
            testUser.firstName = user.firstName;
            testUser.lastName = user.lastName;
            testUser.emailAddress = user.emailAddress;
            testUser.password = hashedPassword;

            await testUser.save();

            chai.request(app)
                .post('/api/auth/login')
                .type('json')
                .send({
                    emailAddress: testUser.emailAddress,
                    password: user.password,
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                });
        });

        it('should return json result with user details', async () => {
            const user = userProvider.getRecord();
            const hashedPassword = await passwords.hashPassword(user.password);

            const testUser = new User();
            testUser.firstName = user.firstName;
            testUser.lastName = user.lastName;
            testUser.emailAddress = user.emailAddress;
            testUser.password = hashedPassword;

            await testUser.save();

            chai.request(app)
                .post('/api/auth/login')
                .type('json')
                .send({
                    emailAddress: testUser.emailAddress,
                    password: user.password,
                })
                .end((_err, res) => {
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('firstName');
                    expect(res.body.firstName).to.not.equal(null);
                    expect(res.body.firstName).to.not.equal('');

                    expect(res.body).to.have.property('lastName');
                    expect(res.body.lastName).to.not.equal(null);
                    expect(res.body.lastName).to.not.equal('');

                    expect(res.body).to.have.property('emailAddress');
                    expect(res.body.emailAddress).to.not.equal(null);
                    expect(res.body.emailAddress).to.not.equal('');

                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.not.equal(null);
                    expect(res.body.token).to.not.equal('');
                });
        });
    });

});