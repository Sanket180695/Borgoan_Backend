const express = require('express');
const router = express.Router();
const agricultureLandInformationService = require('../services/agricultureLandInformation');

router
.post('/get',agricultureLandInformationService.get)
.post('/create',agricultureLandInformationService.validate(),agricultureLandInformationService.create)
.put('/update',agricultureLandInformationService.validate(),agricultureLandInformationService.update)


module.exports = router;