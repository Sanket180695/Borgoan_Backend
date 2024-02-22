const express = require('express');
const router = express.Router();
const utkarshaLoanService = require('../services/utkarshaLoan');

router
.post('/get',utkarshaLoanService.get)
.post('/create',utkarshaLoanService.validate(),utkarshaLoanService.create)
.put('/update',utkarshaLoanService.validate(),utkarshaLoanService.update)


module.exports = router;