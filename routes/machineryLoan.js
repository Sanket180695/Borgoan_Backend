const express = require('express');
const router = express.Router();
const machineryLoanService = require('../services/machineryLoan');

router
.post('/get',machineryLoanService.get)
.post('/create',machineryLoanService.validate(),machineryLoanService.create)
.put('/update',machineryLoanService.validate(),machineryLoanService.update)


module.exports = router;