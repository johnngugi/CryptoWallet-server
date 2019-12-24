var express = require('express');
var router = express.Router();

var auth = require('./auth');
var eth = require('./eth');
var currency = require('./currency');

router.use('/auth', auth);
router.use('/eth', eth);
router.use('/currency', currency);

module.exports = router;