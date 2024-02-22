const express = require('express');
const router = express.Router();
const cashCreditOtherInformationService = require('../services/cashCreditOtherInformation');

router
.post('/get',cashCreditOtherInformationService.get)
.post('/create',cashCreditOtherInformationService.validate(),cashCreditOtherInformationService.create)
.put('/update',cashCreditOtherInformationService.validate(),cashCreditOtherInformationService.update)
.post('/addCashCreditInformation',cashCreditOtherInformationService.addCashCreditInformation)

module.exports = router;