const express = require('express');
const router = express.Router();
const paymentTransactionService = require('../services/paymentTransaction');

router
.post('/get',paymentTransactionService.get)
.post('/create',paymentTransactionService.validate(),paymentTransactionService.create)
.put('/update',paymentTransactionService.validate(),paymentTransactionService.update)


module.exports = router;