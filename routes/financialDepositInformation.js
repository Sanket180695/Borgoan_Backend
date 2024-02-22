const express = require('express');
const router = express.Router();
const financialDepositInformationService = require('../services/financialDepositInformation');

router
.post('/get',financialDepositInformationService.get)
.post('/create',financialDepositInformationService.validate(),financialDepositInformationService.create)
.put('/update',financialDepositInformationService.validate(),financialDepositInformationService.update)


module.exports = router;