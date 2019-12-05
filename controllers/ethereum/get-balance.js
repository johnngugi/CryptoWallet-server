const { getWalletBalance } = require('./utils');

module.exports = {
    async balance(req, res) {
        let balance;
        try {
            balance = await getWalletBalance(req.user.id, req.body.currency);
            if (balance) {
                return res.send(balance);
            }
        } catch (error) {
            if (error.code === 'ER_NO_WALLET') {
                return res.status(422).send({
                    message: error.message
                });
            }
            console.error(error);
            return res.status(500).send({
                error: 'Something wrong happened.'
            });
        }
    },
}