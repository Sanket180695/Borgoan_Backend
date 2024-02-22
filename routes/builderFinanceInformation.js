const express = require('express');
const router = express.Router();
const builderFinanceInformationService = require('../services/builderFinanceInformation');

router
.post('/get',builderFinanceInformationService.get)
.post('/create',builderFinanceInformationService.validate(),builderFinanceInformationService.create)
.put('/update',builderFinanceInformationService.validate(),builderFinanceInformationService.update)


module.exports = router;