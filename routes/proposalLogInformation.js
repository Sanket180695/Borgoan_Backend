const express = require('express');
const router = express.Router();
const enquiaryLogInformationService = require('../services/proposalLogInformation');

router
.post('/get',enquiaryLogInformationService.get)
.post('/create',enquiaryLogInformationService.validate(),enquiaryLogInformationService.create)
.put('/update',enquiaryLogInformationService.validate(),enquiaryLogInformationService.update)


module.exports = router;