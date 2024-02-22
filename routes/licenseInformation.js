const express = require('express');
const router = express.Router();
const licenseInformationService = require('../services/licenseInformation');

router
.post('/get',licenseInformationService.get)
.post('/create',licenseInformationService.validate(),licenseInformationService.create)
.put('/update',licenseInformationService.validate(),licenseInformationService.update)


module.exports = router;