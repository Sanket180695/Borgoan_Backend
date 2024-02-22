const express = require('express');
const router = express.Router();
const expenditureInformationService = require('../services/expenditureInformation');

router
.post('/get',expenditureInformationService.get)
.post('/create',expenditureInformationService.validate(),expenditureInformationService.create)
.put('/update',expenditureInformationService.validate(),expenditureInformationService.update)


module.exports = router;