const express = require('express');
const router = express.Router();
const partnersInformationService = require('../services/partnersInformation');

router
.post('/get',partnersInformationService.get)
.post('/create',partnersInformationService.validate(),partnersInformationService.create)
.put('/update',partnersInformationService.validate(),partnersInformationService.update)


module.exports = router;