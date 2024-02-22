const express = require('express');
const router = express.Router();
const salariedInformationService = require('../services/salariedInformation');

router
.post('/get',salariedInformationService.get)
.post('/create',salariedInformationService.validate(),salariedInformationService.create)
.put('/update',salariedInformationService.validate(),salariedInformationService.update)


module.exports = router;