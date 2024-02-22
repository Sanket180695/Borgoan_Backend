const express = require('express');
const router = express.Router();
const realEstateComercialLoanService = require('../services/realEstateComercialLoan');

router
.post('/get',realEstateComercialLoanService.get)
.post('/create',realEstateComercialLoanService.validate(),realEstateComercialLoanService.create)
.put('/update',realEstateComercialLoanService.validate(),realEstateComercialLoanService.update)


module.exports = router;