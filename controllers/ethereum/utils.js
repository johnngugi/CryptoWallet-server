const { getConnection } = require('typeorm');
const { Wallet } = require('../../models');
const ethereum = require('../../currencies/ethereum');

const fetchWalletFromDb = async (userId, currency) => {
    return await getConnection()
        .getRepository(Wallet)
        .createQueryBuilder('wallet')
        .innerJoinAndSelect('wallet.currency', 'currency')
        .where('wallet.user = :user AND currency.shortName = :shortName', {
            user: userId,
            shortName: currency
        })
        .getOne();
};

const getUserWallet = async (userId, currency) => {
    const wallet = await fetchWalletFromDb(userId, currency);
    if (wallet) {
        return wallet;
    } else {
        let error = new Error('No wallet found for currency associated with this user');
        error.code = 'ER_NO_WALLET';
        throw error;
    }
};

const getWalletBalance = async (userId, currency) => {
    try {
        const wallet = await getUserWallet(userId, currency);
        const balance = await ethereum.getBalance(wallet.address);
        return {
            currency: wallet.currency.name,
            address: wallet.address,
            unit: 'wei',
            balance: parseInt(balance, 10)
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getPrivateKey = async (userId, userPassword, currency) => {
    try {
        const wallet = await getUserWallet(userId, currency);
        const encryptedKey = wallet.encryptedKey;
        const decryptedKey = await ethereum.getPrivateKey(encryptedKey, userPassword);
        return decryptedKey.privateKey;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    getUserWallet,
    getWalletBalance,
    getPrivateKey
}