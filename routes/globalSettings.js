const express = require('express');
const router = express.Router();
const globalSettingsService = require('../services/globalSettings');


router
.post('/getVersions',globalSettingsService.getVersions)
.post('/getTermsConditions',globalSettingsService.getTermsConditions)
.post('/getAccountNumber',globalSettingsService.getAccountNumber)
.post('/getPagesInformation',globalSettingsService.getPagesInformation)
.post('/updatePageInformation',globalSettingsService.updatePageInformation)

module.exports = router;
