const express = require('express');
const router = express.Router();
const dhanwantariLoanService = require('../services/dhanwantariLoan');

router
.post('/get',dhanwantariLoanService.get)
.post('/create',dhanwantariLoanService.validate(),dhanwantariLoanService.create)
.put('/update',dhanwantariLoanService.validate(),dhanwantariLoanService.update)


module.exports = router;