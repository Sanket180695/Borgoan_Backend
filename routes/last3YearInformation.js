const express = require('express');
const router = express.Router();
const last3YearInformationService = require('../services/last3YearInformation');

router
.post('/get',last3YearInformationService.get)
.post('/create',last3YearInformationService.validate(),last3YearInformationService.create)
.put('/update',last3YearInformationService.validate(),last3YearInformationService.update)


module.exports = router;