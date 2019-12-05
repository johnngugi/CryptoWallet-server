var express = require('express');
var router = express.Router();

const { getBalance, send } = require('../../controllers/ethereum');
const isAuthenticated = require('../../policies/IsAuthenticated');

router.post('/balance', isAuthenticated, getBalance);
router.post('/send', isAuthenticated, send);

module.exports = router;