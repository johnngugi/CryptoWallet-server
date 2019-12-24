var express = require('express');
var router = express.Router();

const { getCurrencies } = require('../../controllers/currency');
const isAuthenticated = require('../../policies/IsAuthenticated');

router.get('/', isAuthenticated, getCurrencies);

module.exports = router;