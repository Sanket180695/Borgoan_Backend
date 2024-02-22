const express = require('express');
const router = express.Router();
const realEstateTopUpLoanService = require('../services/realEstateTopUpLoan');

router
.post('/get',realEstateTopUpLoanService.get)
.post('/create',realEstateTopUpLoanService.validate(),realEstateTopUpLoanService.create)
.put('/update',realEstateTopUpLoanService.validate(),realEstateTopUpLoanService.update)
.post('/addTopUpLoan',realEstateTopUpLoanService.validate(),realEstateTopUpLoanService.addTopUpLoan)


module.exports = router;
