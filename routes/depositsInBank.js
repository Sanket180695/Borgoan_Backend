const express = require('express');
const router = express.Router();
const depositsInBankService = require('../services/depositsInBank');

router
.post('/get',depositsInBankService.get)
.post('/create',depositsInBankService.validate(),depositsInBankService.create)
.put('/update',depositsInBankService.validate(),depositsInBankService.update)


module.exports = router;