const express = require('express');
const router = express.Router();
const personalLoanService = require('../services/personalLoan');

router
.post('/get',personalLoanService.get)
.post('/create',personalLoanService.validate(),personalLoanService.create)
.put('/update',personalLoanService.validate(),personalLoanService.update)


module.exports = router;