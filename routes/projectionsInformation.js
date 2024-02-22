const express = require('express');
const router = express.Router();
const projectionsInformationService = require('../services/projectionsInformation');

router
.post('/get',projectionsInformationService.get)
.post('/create',projectionsInformationService.validate(),projectionsInformationService.create)
.put('/update',projectionsInformationService.validate(),projectionsInformationService.update)
.post('/addBulk',projectionsInformationService.addBulk)

module.exports = router;
