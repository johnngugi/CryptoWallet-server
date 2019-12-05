const { createConnection } = require('typeorm');
const app = require('../../../../app');

const userProvider = require('../../../fixtures/user');
const { passwords } = require('../../../../utils');
const { User } = require('../../../../models').User;

const createUserAndSave = async (user) => {
    const hashedPassword = await passwords.hashPassword(user.password);

    const testUser = new User();
    testUser.firstName = user.firstName;
    testUser.lastName = user.lastName;
    testUser.emailAddress = user.emailAddress;
    testUser.password = hashedPassword;

    await testUser.save();
    return testUser;
};

describe('login test suite', () => {
    let connection;
    before(async function () {
        connection = await createConnection({
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
            await createUserAndSave(user);

            const res = await chai.request(app)
                .post('/api/auth/login')
                .type('json')
                .send({
                    emailAddress: user.emailAddress,
                    password: user.password,
                })

            expect(res).to.have.status(200);
        });

        it('should return json result with user details on success', async () => {
            const user = userProvider.getRecord();
            await createUserAndSave(user);

            const res = await chai.request(app)
                .post('/api/auth/login')
                .type('json')
                .send({
                    emailAddress: user.emailAddress,
                    password: user.password,
                });

            const userResult = res.body.user;
            expect(userResult).to.be.a('object');
            expect(userResult).to.have.property('firstName');
            expect(userResult.firstName).to.not.equal(null);
            expect(userResult.firstName).to.not.equal('');

            expect(userResult).to.have.property('lastName');
            expect(userResult.lastName).to.not.equal(null);
            expect(userResult.lastName).to.not.equal('');

            expect(userResult).to.have.property('emailAddress');
            expect(userResult.emailAddress).to.not.equal(null);
            expect(userResult.emailAddress).to.not.equal('');

            expect(userResult).to.have.property('token');
            expect(userResult.token).to.not.equal(null);
            expect(userResult.token).to.not.equal('');
        });

        it('should return status 403 when wrong credentials', async () => {
            const user = userProvider.getRecord();
            await createUserAndSave(user);

            const req = chai.request(app).keepOpen();

            Promise.all([
                req.post('/api/auth/login').send({
                    emailAddress: user.emailAddress,
                    password: ''
                }),
                req.post('/api/auth/login').send({
                    emailAddress: '',
                    password: user.password
                })
            ])
                .then(responses => {
                    expect(responses[0]).to.have.status(403);
                    expect(responses[1]).to.have.status(403);
                })
                .then(() => { req.close() });
        });
    });

    after(async () => {
        await connection.close();
    });
});