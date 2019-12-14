const { getConnection } = require('typeorm');

const createDbRecord = async (modelName, records) => {
    return await getConnection()
        .getRepository(modelName)
        .createQueryBuilder()
        .insert()
        .into(modelName)
        .values(records)
        .execute();
};

module.exports = {
    createDbRecord
}