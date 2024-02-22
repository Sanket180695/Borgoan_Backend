const express = require('express');
const router = express.Router();
const primeSecurityInformationService = require('../services/primeSecurityInformation');

router
.post('/get',primeSecurityInformationService.get)
.post('/create',primeSecurityInformationService.validate(),primeSecurityInformationService.create)
.put('/update',primeSecurityInformationService.validate(),primeSecurityInformationService.update)


module.exports = router;