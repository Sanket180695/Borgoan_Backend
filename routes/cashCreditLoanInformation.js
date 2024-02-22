const express = require('express');
const router = express.Router();
const cashCreditLoanInformationService = require('../services/cashCreditLoanInformation');

router
.post('/get',cashCreditLoanInformationService.get)
.post('/create',cashCreditLoanInformationService.validate(),cashCreditLoanInformationService.create)
.put('/update',cashCreditLoanInformationService.validate(),cashCreditLoanInformationService.update)
.post('/addCashCreditInformation',cashCreditLoanInformationService.validate(),cashCreditLoanInformationService.addCashCreditInformation)


module.exports = router;