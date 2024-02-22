const express = require('express');
const router = express.Router();
const creditInformationService = require('../services/creditInformation');

router
.post('/get',creditInformationService.get)
.post('/create',creditInformationService.validate(),creditInformationService.create)
.put('/update',creditInformationService.validate(),creditInformationService.update)


module.exports = router;