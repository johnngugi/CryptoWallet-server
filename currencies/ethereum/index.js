const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const axios = require('axios');
const { NODE_ENV, ethereum } = require('../../config');
const { Wallet } = require('../../models/Wallet');
const { Currency } = require('../../models/Currency');
const INFURA_ACCESS_TOKEN = ethereum.INFURA_ACCESS_TOKEN;

const mainnet = `https://mainnet.infura.io/v3/${INFURA_ACCESS_TOKEN}`
const testnet = `https://rinkeby.infura.io/v3/${INFURA_ACCESS_TOKEN}`;
let url;

if (NODE_ENV === 'production') {
    url = mainnet;
}
else {
    url = testnet;
}

const web3 = new Web3(url);

const createWallet = async (user) => {
    const currency = await Currency.findOne({ shortName: 'ETH' });

    const account = web3.eth.accounts.create();
    const encryptedAccount = web3.eth.accounts.encrypt(account.privateKey, user.password);

    const wallet = new Wallet();
    wallet.currency = currency.id;
    wallet.address = account.address;
    wallet.encryptedKey = JSON.stringify(encryptedAccount);
    wallet.user = user.id;

    try {
        return wallet.save();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getBalance = async (address) => {
    return web3.eth.getBalance(address);
};

const getGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
    }
    return prices;
};

const sendValue = async (from, to, value, privateKey) => {
    const gasLimitAsInt = 21000;
    const gasLimit = web3.utils.toHex(gasLimitAsInt);
    const gasPrices = await getGasPrices();
    const gasPrice = web3.utils.toHex(web3.utils.toWei(gasPrices.low.toString(), 'gwei'));
    const balance = await getBalance(from);
    const valueAsWei = web3.utils.toWei(value, 'ether');
    value = web3.utils.toHex(valueAsWei);
    const minBalance = (gasLimitAsInt *
        parseFloat(web3.utils.toWei(gasPrices.low.toString(), 'gwei'))) + parseFloat(valueAsWei);

    if (parseFloat(balance, 10) < minBalance) {
        let error = new Error('Insufficient funds for transaction');
        error.code = 'ER_INSUFFICIENT_FUNDS';
        throw error;
    }

    const txCount = await web3.eth.getTransactionCount(from);
    const nonce = web3.utils.toHex(txCount);

    const txData = {
        nonce,
        to,
        value,
        gasLimit,
        gasPrice,
    };

    const privateKeyBuffer = Buffer.from(privateKey.substr(2), 'hex');
    const tx = new Tx(txData, { chain: 'rinkeby' });
    tx.sign(privateKeyBuffer);

    const serialized = tx.serialize();
    const raw = '0x' + serialized.toString('hex');

    return await web3.eth.sendSignedTransaction(raw);
};

const getPrivateKey = async (encryptedKey, userPassword) => {
    return web3.eth.accounts.decrypt(encryptedKey, userPassword);
};

module.exports = {
    createWallet,
    getBalance,
    sendValue,
    getPrivateKey,
    web3
}