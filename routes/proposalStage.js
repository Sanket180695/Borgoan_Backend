const express = require('express');
const router = express.Router();
const proposalStageService = require('../services/proposalStage');

router
    .post('/get', proposalStageService.get)
    .post('/create', proposalStageService.validate(), proposalStageService.create)
    .put('/update', proposalStageService.validate(), proposalStageService.update)


module.exports = router;
