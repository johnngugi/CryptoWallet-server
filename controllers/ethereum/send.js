const { getUserWallet, getPrivateKey } = require('./utils');
const { sendValue } = require('../../currencies/ethereum');

module.exports = {
    async send(req, res) {
        try {
            const wallet = await getUserWallet(req.user.id, 'ETH');
            const privateKey = await getPrivateKey(req.user.id, req.user.password, 'ETH');
            const txHash = await sendValue(wallet.address, req.body.to, req.body.value, privateKey);
            return res.send({
                transactionHash: txHash
            });
        } catch (error) {
            if (error.code) {
                switch (error.code) {
                    case 'ER_NO_WALLET':
                        return res.status(403).send({
                            error: error.message
                        });
                    case 'ER_INSUFFICIENT_FUNDS':
                        return res.status(422).send({
                            error: error.message
                        });
                    default:
                        return res.status(500).send({
                            error: 'Something went wrong'
                        });
                }
            }
            console.error(error);
            return res.status(500).send({
                error: 'Something went wrong'
            });
        }
    }
}