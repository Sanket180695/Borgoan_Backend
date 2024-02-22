const express = require('express');
const router = express.Router();
const personalInformationService = require('../services/personalInformation');

router
.post('/get',personalInformationService.get)
.post('/create',personalInformationService.validate(),personalInformationService.create)
.put('/update',personalInformationService.validate(),personalInformationService.update)
.post('/getPersonalInfo',personalInformationService.getPersonalInfo)
.post('/updatePersonalInfo',personalInformationService.updatePersonalInfo)

module.exports = router;
