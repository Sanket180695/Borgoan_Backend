const express = require('express');
const router = express.Router();
const reportService = require('../services/report');

router
.post('/getBranchProposalAmount',reportService.getBranchProposalAmountReport)
.post('/getBranchProposalcount',reportService.getBranchProposalcountReport)
.post('/getBranchStageProposalAmount',reportService.getBranchStageProposalAmountReport)
.post('/getBranchStageProposalcount',reportService.getBranchStageProposalcountReport)
.post('/getBranchLoanTypeStageProposalcountReport',reportService.getBranchLoanTypeStageProposalcountReport)
.post('/getBranchLoanTypeStageProposalAmountReport',reportService.getBranchLoanTypeStageProposalAmountReport)


.post('/getPraposalDocumentList',reportService.getPraposalDocumentList)
.post('/getPraposalExtraInfoStatus',reportService.getPraposalExtraInfoStatus)
.post('/getPraposalSummary',reportService.getPraposalSummary)
.post('/getProposalDocumentSummary',reportService.getPraposalDocumentSummary)
.post('/getPraposalExtraInfoSummary',reportService.getPraposalExtraInfoSummary)
.post('/getPraposalCibilSummary',reportService.getPraposalCibilSummary)
.post('/getBranchPraposalList',reportService.getBranchPraposalList)
.post('/getApplicantMaster',reportService.getApplicantMaster)
.post('/getUserSummary',reportService.getUserSummary)
.post('/getPraposalStageHistory',reportService.getPraposalStageHistory)
.post('/getRoleMaster',reportService.getRoleMaster)
.post('/getPrioritySectorLoan',reportService.getPrioritySectorLoan)
.post('/getWeakerSectionLoan',reportService.getWeakerSectionLoan)
.post('/getIndustrialMarkingLoan',reportService.getIndustrialMarkingLoan)
.post('/getRealEstateMarkingLoan',reportService.getRealEstateMarkingLoan)
.post('/getScrutinyFeeCollected',reportService.getScrutinyFeeCollected)
.post('/getBranchWiseScrutinyFeeCollection',reportService.getBranchWiseScrutinyFeeCollection)
.post('/getLoanTypehWiseScrutinyFeeCollection',reportService.getLoanTypehWiseScrutinyFeeCollection)
.post('/getPrioritySectorStatus',reportService.getPrioritySectorStatus)
.post('/getWeakerSectorStatus',reportService.getWeakerSectorStatus)
.post('/getIndustrialMarkingStatus',reportService.getIndustrialMarkingStatus)
.post('/getRealEstateMarkingStatus',reportService.getRealEstateMarkingStatus)
.post('/getPrioritySectorTargetCompletion',reportService.getPrioritySectorTargetCompletion)
.post('/getWeakerSectorTargetCompletion',reportService.getWeakerSectorTargetCompletion)
.post('/getIndustrialMarkingTargetCompletion',reportService.getIndustrialMarkingTargetCompletion)
.post('/getRealEstateMarkingTargetCompletion',reportService.getRealEstateMarkingTargetCompletion)
.post('/getLoanTypeInstallmentFrequencyWisePraposalCount',reportService.getLoanTypeInstallmentFrequencyWisePraposalCount)


module.exports = router;