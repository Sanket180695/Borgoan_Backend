const express = require('express');
const router = express.Router();
const bankLoanTypeService = require('../services/bankLoanType');

router
.post('/get',bankLoanTypeService.get)
.post('/create',bankLoanTypeService.validate(),bankLoanTypeService.create)
.put('/update',bankLoanTypeService.validate(),bankLoanTypeService.update)


module.exports = router;