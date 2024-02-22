const express = require('express');
const router = express.Router();
const financialInformationService = require('../services/financialInformation');

router
.post('/get',financialInformationService.get)
.post('/create',financialInformationService.validate(),financialInformationService.create)
.put('/update',financialInformationService.validate(),financialInformationService.update)
.post('/getFinancialInfo',financialInformationService.getFinancialInfo)
.post('/updateFinancialInfo',financialInformationService.validate(),financialInformationService.updateFinancialInfo)

module.exports = router;
