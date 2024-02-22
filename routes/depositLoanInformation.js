const express = require('express');
const router = express.Router();
const depositLoanInformationService = require('../services/depositLoanInformation');

router
    .post('/get', depositLoanInformationService.get)
    .post('/create', depositLoanInformationService.validate(), depositLoanInformationService.create)
    .put('/update', depositLoanInformationService.validate(), depositLoanInformationService.update)


module.exports = router;