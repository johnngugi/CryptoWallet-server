const { getWalletBalance, getPrivateKey } = require('./utils');
const { sendValue } = require('../../currencies/ethereum');

module.exports = {
    async send(req, res) {
        const balance = await getWalletBalance(req.user.id, req.body.currency);
        if (balance.balance < req.body.amount) {
            return res.status(422).send({
                message: 'Balance too low'
            });
        }
        try {
            const privateKey = getPrivateKey(req.user.id, req.user.password);
            const txHash = await sendValue(balance.address, req.body.to, req.body.value, privateKey);
            return res.send({
                transactionHash: txHash
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                error: 'Something went wrong'
            })
        }
    }
}