const express = require('express');
const router = express.Router();
const topUpLoanReasonDetailsService = require('../services/topUpLoanReasonDetails');

router
.post('/get',topUpLoanReasonDetailsService.get)
.post('/create',topUpLoanReasonDetailsService.validate(),topUpLoanReasonDetailsService.create)
.put('/update',topUpLoanReasonDetailsService.validate(),topUpLoanReasonDetailsService.update)


module.exports = router;