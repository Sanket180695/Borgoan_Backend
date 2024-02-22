const express = require('express');
const router = express.Router();
const incomeInformationService = require('../services/incomeInformation');

router
.post('/get',incomeInformationService.get)
.post('/create',incomeInformationService.validate(),incomeInformationService.create)
.put('/update',incomeInformationService.validate(),incomeInformationService.update)
.post('/getAllIncomeInformation',incomeInformationService.getAllIncomeInformation)

module.exports = router;