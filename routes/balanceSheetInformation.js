const express = require('express');
const router = express.Router();
const balanceSheetInformationService = require('../services/balanceSheetInformation');

router
.post('/get',balanceSheetInformationService.get)
.post('/create',balanceSheetInformationService.validate(),balanceSheetInformationService.create)
.put('/update',balanceSheetInformationService.validate(),balanceSheetInformationService.update)
.post('/addBulk',balanceSheetInformationService.addBulk)


module.exports = router;