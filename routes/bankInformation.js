const express = require('express');
const router = express.Router();
const bankInformationService = require('../services/bankInformation');

router
.post('/get',bankInformationService.get)
.post('/create',bankInformationService.validate(),bankInformationService.create)
.put('/update',bankInformationService.validate(),bankInformationService.update)


module.exports = router;