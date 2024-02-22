const express = require('express');
const router = express.Router();
const feeDetailsService = require('../services/feeDetails');

router
.post('/get',feeDetailsService.get)
.post('/create',feeDetailsService.validate(),feeDetailsService.create)
.put('/update',feeDetailsService.validate(),feeDetailsService.update)


module.exports = router;