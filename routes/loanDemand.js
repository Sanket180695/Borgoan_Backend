const express = require('express');
const router = express.Router();
const loanDemandService = require('../services/loanDemand');

router
.post('/get',loanDemandService.get)
.post('/create',loanDemandService.validate(),loanDemandService.create)
.put('/update',loanDemandService.validate(),loanDemandService.update)
.post('/updateLoanScheme',loanDemandService.updateLoanScheme)


module.exports = router;
