const express = require('express');
const router = express.Router();
const jointAccountInformationService = require('../services/jointAccountInformation');

router
.post('/get',jointAccountInformationService.get)
.post('/create',jointAccountInformationService.validate(),jointAccountInformationService.create)
.put('/update',jointAccountInformationService.validate(),jointAccountInformationService.update)


module.exports = router;