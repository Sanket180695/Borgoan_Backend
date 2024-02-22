const express = require('express');
const router = express.Router();
const addressInformationService = require('../services/addressInformation');

router
.post('/get',addressInformationService.get)
.post('/create',addressInformationService.validate(),addressInformationService.create)
.put('/update',addressInformationService.validate(),addressInformationService.update)
.post('/getAddress',addressInformationService.getAddress)

module.exports = router;