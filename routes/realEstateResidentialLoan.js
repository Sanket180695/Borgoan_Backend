const express = require('express');
const router = express.Router();
const realEstateResidentialLoanService = require('../services/realEstateResidentialLoan');

router
.post('/get',realEstateResidentialLoanService.get)
.post('/create',realEstateResidentialLoanService.validate(),realEstateResidentialLoanService.create)
.put('/update',realEstateResidentialLoanService.validate(),realEstateResidentialLoanService.update)


module.exports = router;