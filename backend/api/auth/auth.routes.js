const express = require('express');
var router = express.Router();
const { doLogin, doLogout, doSignup } = require('./auth.controller');
const { requireAuth } = require('../../middlewares/requireAuth');


router.post('/signup', doSignup);
router.post('/login', doLogin);
router.post('/logout', requireAuth, doLogout);

module.exports = router;