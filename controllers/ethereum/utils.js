const { getConnection } = require('typeorm');
const { Wallet } = require('../../models');
const ethereum = require('../../currencies/ethereum');

const getUserWallet = async (userId, currency) => {
    return await getConnection()
        .getRepository(Wallet)
        .createQueryBuilder()
        .select('wallet')
        .from(Wallet, 'wallet')
        .innerJoinAndSelect('wallet.currency', 'currency')
        .where('wallet.user = :user AND currency.shortName = :shortName', {
            user: userId,
            shortName: currency
        })
        .getOne();
};

const getWalletBalance = async (userId, currency) => {
    const wallet = await getUserWallet(userId, currency);
    if (wallet) {
        const balance = await ethereum.getBalance(wallet.address);
        return {
            currency: wallet.currency.name,
            address: wallet.address,
            unit: 'wei',
            balance
        };
    }
    let error = new Error('No wallet found for currency associated with this user');
    error.code = 'ER_NO_WALLET';
    throw error;
};

const getPrivateKey = async (userId, userPassword, currency) => {
    const wallet = await getUserWallet(userId, currency);
    if (wallet) {
        const encryptedKey = wallet.encryptedKey;
        return ethereum.getPrivateKey(encryptedKey, userPassword);
    }
    let error = new Error('No wallet found for currency associated with this user');
    error.code = 'ER_NO_WALLET';
    throw error;
};

module.exports = {
    getUserWallet,
    getWalletBalance,
    getPrivateKey
}