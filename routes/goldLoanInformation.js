const express = require('express');
const router = express.Router();
const goldLoanInformationService = require('../services/goldLoanInformation');

router
.post('/get',goldLoanInformationService.get)
.post('/create',goldLoanInformationService.validate(),goldLoanInformationService.create)
.put('/update',goldLoanInformationService.validate(),goldLoanInformationService.update)


module.exports = router;