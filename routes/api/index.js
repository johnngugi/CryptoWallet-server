var express = require('express');
var router = express.Router();

var auth = require('./auth');
var eth = require('./eth');

router.use('/auth', auth);
router.use('/eth', eth);

module.exports = router;