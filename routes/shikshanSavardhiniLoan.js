const express = require('express');
const router = express.Router();
const shikshanSavardhiniLoanService = require('../services/shikshanSavardhiniLoan');

router
    .post('/get', shikshanSavardhiniLoanService.get)
    .post('/create', shikshanSavardhiniLoanService.validate(), shikshanSavardhiniLoanService.create)
    .put('/update', shikshanSavardhiniLoanService.validate(), shikshanSavardhiniLoanService.update)
.post('/addEducationLoanInformation', shikshanSavardhiniLoanService.addLoanExtraInformation)

module.exports = router