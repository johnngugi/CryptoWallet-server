const { getWalletBalance, getPrivateKey } = require('./utils');
const { sendValue } = require('../../currencies/ethereum');

module.exports = {
    async send(req, res) {
        let balance;
        try {
            balance = await getWalletBalance(req.user.id, req.body.currency);
        } catch (error) {
            if (error.code) {
                switch (error.code) {
                    case 'ER_NO_WALLET':
                        return res.status(403).send({
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

        if (balance.balance < req.body.amount) {
            return res.status(422).send({
                message: 'Balance too low'
            });
        }
        try {
            const privateKey = await getPrivateKey(req.user.id, req.user.password, req.body.currency);
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