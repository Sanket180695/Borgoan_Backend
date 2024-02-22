const express = require('express');
const router = express.Router();
const rentDiscountingLoanService = require('../services/rentDiscountingLoan');

router
.post('/get',rentDiscountingLoanService.get)
.post('/create',rentDiscountingLoanService.validate(),rentDiscountingLoanService.create)
.put('/update',rentDiscountingLoanService.validate(),rentDiscountingLoanService.update)


module.exports = router;