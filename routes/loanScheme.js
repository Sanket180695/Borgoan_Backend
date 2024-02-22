const express = require('express');
const router = express.Router();
const loanSchemeService = require('../services/loanScheme');

router
.post('/get',loanSchemeService.get)
.post('/create',loanSchemeService.validate(),loanSchemeService.create)
.put('/update',loanSchemeService.validate(),loanSchemeService.update)


module.exports = router;