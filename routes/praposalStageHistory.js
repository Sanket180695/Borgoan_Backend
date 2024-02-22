const express = require('express');
const router = express.Router();
const praposalStageHistoryService = require('../services/praposalStageHistory');

router
    .post('/get', praposalStageHistoryService.get)
    .post('/create', praposalStageHistoryService.validate(), praposalStageHistoryService.create)
    .put('/update', praposalStageHistoryService.validate(), praposalStageHistoryService.update)


module.exports = router;
