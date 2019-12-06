const { createConnection, getConnection } = require('typeorm');
const userProvider = require('../../../fixtures/user');
const currenciesProvider = require('../../../fixtures/currency');

const createDbRecord = async (modelName, records) => {
    return await getConnection()
        .getRepository(modelName)
        .createQueryBuilder()
        .insert()
        .into(modelName)
        .values(records)
        .execute();
};

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
    let token;
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
        token = results[1].body.user.token;
        await connection.query('PRAGMA foreign_keys=ON');
    });

    describe('#POST /api/eth/balance', () => {

        it('should respond with status 200 on successful request', async () => {
            const bearerToken = `Bearer ${token}`;
            const res = await chai.request(app)
                .post('/api/eth/balance')
                .set('Authorization', bearerToken)
                .send({
                    currency: 'ETH',
                });

            expect(res).to.have.status(200);
        });

    });

    after(async () => {
        await connection.close();
    });

});