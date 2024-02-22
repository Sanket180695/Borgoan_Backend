const express = require('express');
const router = express.Router();
const costInformationService = require('../services/costInformation');

router
.post('/get',costInformationService.get)
.post('/create',costInformationService.validate(),costInformationService.create)
.put('/update',costInformationService.validate(),costInformationService.update)


module.exports = router;