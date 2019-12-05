var express = require('express');
var router = express.Router();

const AuthController = require('../../controllers/Auth');
const AuthPolicy = require('../../policies/AuthPolicy');

router.post('/register', AuthPolicy.register, AuthController.register);
router.post('/login', AuthController.login)

module.exports = router;