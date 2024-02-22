const express = require('express');
const router = express.Router();
const praposalService = require('../services/praposal');

router
.post('/get',praposalService.get)
.post('/create',praposalService.validate(),praposalService.create)
.post('/update',praposalService.validate(),praposalService.update)
.post('/updateStage',praposalService.updateStage)
.post('/updatePraposalBranch',praposalService.updatePraposalBranch)
.post('/updateCibilInfo',praposalService.updateCibilInfo)
.post('/changeStatus',praposalService.changeStatus)
.post('/updateStatus',praposalService.updateStatus)
.post('/updateProcessingInfo', praposalService.updateProposalProcessingInfo)
.post('/updateProposalInfo', praposalService.updateProposalInfo)
.post('/createProposal', praposalService.createProposal)
.post('/getPraposalNumber', praposalService.getPraposalNumber)

module.exports = router;
