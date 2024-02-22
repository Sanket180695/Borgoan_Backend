const express = require('express');
const router = express.Router();
const loanPurposeService = require('../services/loanpurpose');

router
.post('/get',loanPurposeService.get)
.post('/create',loanPurposeService.validate(),loanPurposeService.create)
.put('/update',loanPurposeService.validate(),loanPurposeService.update)


module.exports = router;