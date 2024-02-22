const express = require('express');
const router = express.Router();
const shubhVivahLoanInformationService = require('../services/shubhVivahLoanInformation');

router
.post('/get',shubhVivahLoanInformationService.get)
.post('/create',shubhVivahLoanInformationService.validate(),shubhVivahLoanInformationService.create)
.put('/update',shubhVivahLoanInformationService.validate(),shubhVivahLoanInformationService.update)


module.exports = router;