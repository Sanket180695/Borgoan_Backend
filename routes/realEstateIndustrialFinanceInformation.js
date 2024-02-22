const express = require('express');
const router = express.Router();
const realEstateIndustrialFinanceInformationService = require('../services/realEstateIndustrialFinanceInformation');

router
.post('/get',realEstateIndustrialFinanceInformationService.get)
.post('/create',realEstateIndustrialFinanceInformationService.validate(),realEstateIndustrialFinanceInformationService.create)
.put('/update',realEstateIndustrialFinanceInformationService.validate(),realEstateIndustrialFinanceInformationService.update)


module.exports = router;