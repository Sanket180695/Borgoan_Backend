
const express = require('express');
const router = express.Router();
const firmInformationService = require('../services/firmInformation');

router
.post('/get',firmInformationService.get)
.post('/create',firmInformationService.validate(),firmInformationService.create)
.put('/update',firmInformationService.validate(),firmInformationService.update)
.post('/getFirmInformation',firmInformationService.getFirmInformation)

module.exports = router;