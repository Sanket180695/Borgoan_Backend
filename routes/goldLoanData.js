const express = require('express');
const router = express.Router();
const goldLoanDataService = require('../services/goldLoanData');

router
.post('/get',goldLoanDataService.get)
.post('/create',goldLoanDataService.validate(),goldLoanDataService.create)
.put('/update',goldLoanDataService.validate(),goldLoanDataService.update)


module.exports = router;