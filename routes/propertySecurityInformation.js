
const express = require('express');
const router = express.Router();
const propertySecurityInformationService = require('../services/propertySecurityInformation');

router
.post('/get',propertySecurityInformationService.get)
.post('/create',propertySecurityInformationService.validate(),propertySecurityInformationService.create)
.put('/update',propertySecurityInformationService.validate(),propertySecurityInformationService.update)
.post('/addBulk',propertySecurityInformationService.addBulk)

module.exports = router;