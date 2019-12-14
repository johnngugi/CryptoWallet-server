var express = require('express');
var router = express.Router();

const { getBalance, send } = require('../../controllers/ethereum');
const isAuthenticated = require('../../policies/IsAuthenticated');
const ethRequestPolicy = require('../../policies/ethRequestPolicy');

router.get('/balance', isAuthenticated, getBalance);
router.post('/send', isAuthenticated, ethRequestPolicy.send, send);

module.exports = router;