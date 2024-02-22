const express = require('express');
const router = express.Router();
const businessFirmInformationService = require('../services/businessFirmInformation');

router
.post('/get',businessFirmInformationService.get)
.post('/create',businessFirmInformationService.validate(),businessFirmInformationService.create)
.put('/update',businessFirmInformationService.validate(),businessFirmInformationService.update)
.post('/addBusinessInfo',businessFirmInformationService.validate(),businessFirmInformationService.addBusinessInfo)


module.exports = router;
