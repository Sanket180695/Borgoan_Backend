const express = require('express');
const router = express.Router();
const termDeposit = require('../services/termDeposit');

router
.post('/get',termDeposit.get)
.post('/create',termDeposit.validate(),termDeposit.create)
.post('/update',termDeposit.validate(),termDeposit.update)


module.exports = router;