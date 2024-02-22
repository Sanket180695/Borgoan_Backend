const express = require('express');
const router = express.Router();
const applicantExtraInformationService = require('../services/applicantExtraInformation');

router
.post('/get',applicantExtraInformationService.get)
.post('/create',applicantExtraInformationService.validate(),applicantExtraInformationService.create)
.put('/update',applicantExtraInformationService.validate(),applicantExtraInformationService.update)
.post('/getApplicantExtraInformation',applicantExtraInformationService.getApplicantExtraInformation)
.post('/addExtraInformation',applicantExtraInformationService.addExtraInformation)

module.exports = router;