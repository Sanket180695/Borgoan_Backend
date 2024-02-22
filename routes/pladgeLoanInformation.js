const express = require('express');
const router = express.Router();
const pladgeLoanInformationService = require('../services/pladgeLoanInformation');

router
.post('/get',pladgeLoanInformationService.get)
.post('/create',pladgeLoanInformationService.validate(),pladgeLoanInformationService.create)
.put('/update',pladgeLoanInformationService.validate(),pladgeLoanInformationService.update)


module.exports = router;