const { getConnection } = require('typeorm');
const { Wallet } = require('../../models');
const ethereum = require('../../currencies/ethereum');

const getUserWallet = async (userId, currency) => {
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

const getWalletBalance = async (userId, currency) => {
    try {
        const wallet = await getUserWallet(userId, currency);
        if (wallet) {
            const balance = await ethereum.getBalance(wallet.address);
            return {
                currency: wallet.currency.name,
                address: wallet.address,
                unit: 'wei',
                balance: parseInt(balance, 10)
            };
        } else {
            let error = new Error('No wallet found for currency associated with this user');
            error.code = 'ER_NO_WALLET';
            throw error;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getPrivateKey = async (userId, userPassword, currency) => {
    try {
        const wallet = await getUserWallet(userId, currency);
        if (wallet) {
            const encryptedKey = wallet.encryptedKey;
            const decryptedKey = await ethereum.getPrivateKey(encryptedKey, userPassword);
            return decryptedKey.privateKey;
        } else {
            let error = new Error('No wallet found for currency associated with this user');
            error.code = 'ER_NO_WALLET';
            throw error;
        }
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