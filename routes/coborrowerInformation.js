const express = require('express');
const router = express.Router();
const coborrowerInformationService = require('../services/coborrowerInformation');

router
.post('/get',coborrowerInformationService.get)
.post('/create',coborrowerInformationService.validate(),coborrowerInformationService.create)
.put('/update',coborrowerInformationService.validate(),coborrowerInformationService.update)
.post('/addBulk',coborrowerInformationService.addBulk)   
.post('/addCoborrower',coborrowerInformationService.checkCoborrowerMobileNo,coborrowerInformationService.addCoborrower)   

module.exports = router;
