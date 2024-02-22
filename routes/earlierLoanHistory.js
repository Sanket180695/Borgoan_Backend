const express = require('express');
const router = express.Router();
const earlierLoanHistoryService = require('../services/earlierLoanHistory');

router
.post('/get',earlierLoanHistoryService.get)
.post('/create',earlierLoanHistoryService.validate(),earlierLoanHistoryService.create)
.put('/update',earlierLoanHistoryService.validate(),earlierLoanHistoryService.update)


module.exports = router;