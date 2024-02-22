const express = require('express');
const router = express.Router();
const profitabiltyStatementInformationService = require('../services/profitabiltyStatementInformation');

router
.post('/get',profitabiltyStatementInformationService.get)
.post('/create',profitabiltyStatementInformationService.validate(),profitabiltyStatementInformationService.create)
.put('/update',profitabiltyStatementInformationService.validate(),profitabiltyStatementInformationService.update)


module.exports = router;