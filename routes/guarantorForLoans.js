const express = require('express');
const router = express.Router();
const guarantorForLoansService = require('../services/guarantorForLoans');

router
.post('/get',guarantorForLoansService.get)
.post('/create',guarantorForLoansService.validate(),guarantorForLoansService.create)
.put('/update',guarantorForLoansService.validate(),guarantorForLoansService.update)


module.exports = router;