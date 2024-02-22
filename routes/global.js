const express = require('express');
const router = express.Router();

//package declaration
const formidable = require('formidable');

const mm = require('../utilities/globalModule')
//service declaration
var globalService = require('../services/global');
//var loggerService = require('../logger/logger');



//routes
router
    .all('*', globalService.requireAuthentication)
    .use('/api', globalService.checkToken)
    .use('/api/globalSettings/', require('./globalSettings'))
    .use('/api/form', require('./UserAccess/form'))
    .use('/api/role', require('./UserAccess/role'))
    .use('/api/roleDetails', require('./UserAccess/roleDetail'))
    .use('/api/user', require('./UserAccess/user'))
    .use('/api/userRoleMapping', require('./UserAccess/userRoleMapping'))

    .use('/api/applicantDocument', require('./applicantDocument'))
    .use('/api/applicantDocumentComment', require('./applicantDocumentComment'))
    .use('/api/applicantType', require('./applicantType'))
    .use('/api/branch', require('./branch'))
    .use('/api/document', require('./document'))
    .use('/api/documentGroup', require('./documentGroup'))
    .use('/api/homePageBanner', require('./homePageBanner'))
    .use('/api/homePageInformation', require('./homePageInformation'))
    .use('/api/loanTypeDocumentMapping', require('./loanTypeDocumentMapping'))
    .use('/api/loanTypes', require('./loanTypes'))
    .use('/api/praposal', require('./praposal'))
    .use('/api/praposalStageHistory', require('./praposalStageHistory'))
    .use('/api/proposalStage', require('./proposalStage'))
    .use('/api/userActivityLog', require('./userActivityLog'))
    .use('/api/applicant', require('./applicant'))
    .use('/api/notification', require('./notification'))
    .post('/sendPendingDocumentNotification', require('../services/global').sendPendingDocumentNotification)

    .use('/api/personalInformation', require('./personalInformation'))
    .use('/api/addressInformation', require('./addressInformation'))
    .use('/api/familyDetail', require('./familyDetail'))

    .use('/api/incomeSource', require('./incomeSource'))
    .use('/api/extraInformation', require('./extraInformation'))
    .use('/api/deductionDetails', require('./deductionDetails'))
    .use('/api/installmentFrequency', require('./installmentFrequency'))


    .use('/api/agricultureLandInformation', require('./agricultureLandInformation'))
    .use('/api/bankInformation', require('./bankInformation'))
    .use('/api/businessFirmInformation', require('./businessFirmInformation'))
    .use('/api/creditInformation', require('./creditInformation'))
    .use('/api/depositsInBank', require('./depositsInBank'))
    .use('/api/earlierLoanHistory', require('./earlierLoanHistory'))
    .use('/api/factoryUnitInformation', require('./factoryUnitInformation'))
    .use('/api/firmInformation', require('./firmInformation'))
    .use('/api/guarantorForLoans', require('./guarantorForLoans'))
    .use('/api/incomeInformation', require('./incomeInformation'))
    .use('/api/last3YearInformation', require('./last3YearInformation'))
    .use('/api/licenseInformation', require('./licenseInformation'))
    .use('/api/loanDemand', require('./loanDemand'))
    .use('/api/loanTakenInformation', require('./loanTakenInformation'))
    .use('/api/manufacturingInformation', require('./manufacturingInformation'))
    .use('/api/partnersInformation', require('./partnersInformation'))
    .use('/api/primeSecurityInformation', require('./primeSecurityInformation'))
    .use('/api/propertyInformation', require('./propertyInformation'))
    .use('/api/propertySecurityInformation', require('./propertySecurityInformation'))
    .use('/api/sisterOrAssociateConcern', require('./sisterOrAssociateConcern'))
    .use('/api/financialInformation', require('./financialInformation'))
    .use('/api/salariedInformation', require('./salariedInformation'))
    .use('/api/applicantExtraInformation', require('./applicantExtraInformation'))
    .use('/api/projectionsInformation', require('./projectionsInformation'))
    .use('/api/managementOfSalesInformation', require('./managementOfSalesInformation'))
    .use('/api/guarantorInformation', require('./guarantorInformation'))
    .use('/api/detailsOfEmployee', require('./detailsOfEmployee'))
    .use('/api/balanceSheetInformation', require('./balanceSheetInformation'))
    .use('/api/paymentTransaction', require('./paymentTransaction'))
    .use('/api/incomeYear', require('./incomeYear'))

    .use('/api/costInformation', require('./costInformation'))
    .use('/api/meansInformation', require('./meansInformation'))
    .use('/api/bankLoanType', require('./bankLoanType'))
     .use('/api/depositLoanInformation', require('./depositLoanInformation'))





    //--Loan specific question api routes
    .use('/api/loanScheme', require('./loanScheme'))
    .use('/api/personalLoan', require('./personalLoan'))
    .use('/api/shikshanSavardhiniLoan', require('./shikshanSavardhiniLoan'))
    .use('/api/feeDetails', require('./feeDetails'))
    .use('/api/consumerDurablesLoans', require('./consumerDurablesLoans'))
    .use('/api/vehicleLoan', require('./vehicleLoan'))
    .use('/api/machineryLoan', require('./machineryLoan'))
    .use('/api/pladgeLoanInformation', require('./pladgeLoanInformation'))
    .use('/api/utkarshaLoan', require('./utkarshaLoan'))
    .use('/api/dhanwantariLoan', require('./dhanwantariLoan'))
    .use('/api/shubhVivahLoanInformation', require('./shubhVivahLoanInformation'))
    .use('/api/builderFinanceInformation', require('./builderFinanceInformation'))
    .use('/api/realEstateIndustrialFinanceInformation', require('./realEstateIndustrialFinanceInformation'))
    .use('/api/workOrderDetails', require('./workOrderDetails'))
    .use('/api/cashCreditOtherInformation', require('./cashCreditOtherInformation'))
    .use('/api/realEstateResidentialLoan', require('./realEstateResidentialLoan'))

    .use('/api/realEstateComercialLoan', require('./realEstateComercialLoan'))
    .use('/api/cashCreditOtherInformation', require('./cashCreditOtherInformation'))
    .use('/api/realEstateResidentialComercialLoanInformation', require('./realEstateResidentialComercialLoanInformation'))
    .use('/api/cashCreditLoanInformation', require('./cashCreditLoanInformation'))





    //--MicroService
    .use('/api/jyotimicro',require('./jyotimicro'))
    .use('/api/jyotimicroGuarantor',require('./jyotimicroGuarantor'))
    .use('/api/jyotimicroGuarantorAddress',require('./jyotimicroGuarantorAddress'))
    .use('/api/jyotimicroGuarantorPersonal',require('./jyotimicroGuarantorPersonal'))
    .use('/api/jyotimicroGuarantorPersonalBanker',require('./jyotimicroGuarantorPersonalBanker'))
    .use('/api/jyotimicroGuarantorPersonalEmployer',require('./jyotimicroGuarantorPersonalEmployer'))
    .use('/api/jyotimicroGuarantorProperty',require('./jyotimicroGuarantorProperty'))


    .use('/api/termDeposit', require('./termDeposit'))





    .use('/api/industryCode', require('./industryCode'))
    .use('/api/weekerSectionCode', require('./weekerSectionCode'))
    .use('/api/priorityCode', require('./priorityCode'))
    .use('/api/realEstateTopUpLoan', require('./realEstateTopUpLoan'))
    .use('/api/topUpLoanReasonDetails', require('./topUpLoanReasonDetails'))
    .use('/api/toursAndTravelLoan', require('./toursAndTravelLoan'))
    .use('/api/foreignTravelFamilyDetail', require('./foreignTravelFamilyDetail'))
    .use('/api/rentDiscountingLoan', require('./rentDiscountingLoan'))

    .use('/api/repaymentCapacityInformation', require('./repaymentCapacityInformation'))
    .use('/api/profitabiltyStatementInformation', require('./profitabiltyStatementInformation'))
    .use('/api/coborrowerInformation', require('./coborrowerInformation'))


    .use('/api/cashCreditAddressDetails', require('./cashCreditAddressDetails'))
    .use('/api/firmBranchesDetails', require('./firmBranchesDetails'))
    .use('/api/firmDirectorsDetails', require('./firmDirectorsDetails'))
    .use('/api/travellingDetailsInformation', require('./travellingDetailsInformation'))
    .use('/api/goldLoanInformation', require('./goldLoanInformation'))
	.use('/api/goldItem', require('./goldItem'))
    .use('/api/goldLoanData', require('./goldLoanData'))

.use('/api/term', require('./term'))
.use('/api/loanPurpose', require('./loanPurpose'))

.use('/api/financialDepositInformation', require('./financialDepositInformation'))
.use('/api/houseShopRentInformation', require('./houseShopRentInformation'))
.use('/api/expenditureInformation', require('./expenditureInformation'))
.use('/api/jointAccountInformation', require('./jointAccountInformation'))

 .use('/api/subPropertyInformation', require('./subPropertyInformation'))
 .use('/api/userBranchMapping', require('./userBranchMapping'))

	//Reports
    .use('/api/report', require('./report'))
	    .use('/api/proposalLogInformation', require('./proposalLogInformation'))
.use('/api/reportScheduler', require('./reportScheduler'))
.use('/report/sendSchedularReports', require('../services/report').sendSchedularReports)
.use('/schedularReport', require('./report'))


	.post('/praposal/createByBot', require('../services/praposal').createProposalByBot)	
	.post('/app/getInfo', require('../services/globalSettings').getAppInfo)	
    .post('/globalSettings/getTermsConditions', require('../services/globalSettings').getTermsConditions)
    //.post('/applicant/create', require('../services/applicant').create)
    .post('/applicant/register', require('../services/applicant').register)
    .post('/api/applicant/updateLastLogin', require('../services/applicant').updateLastLogin)

    // .post('/student/login', require('../services/StudentOnboarding/student').login)
    .post('/sendOtp', require('../services/global').sendOtpToDevice)
    .post('/user/login', require('../services/UserAccess/user').login)
    .post('/api/user/getForms', require('../services/UserAccess/user').getForms)
    // //.post('/getChapters', require('../services/MasterSyllabus/chapter').getChapters)
    // .post('/api/sendMail', require('../services/global').sendEmail)

    .post('/send', (req, res) => { require('../utilities/firebase').generateNotification("", "faZa1L6C_k4:APA91bFkFOBHA8FVMBn6niGOdpIQtF_sKVZcVdzxc4R3wrZzJH32P_XEsEhpj4kwvXrja3BT2L9zl44dIKNaJDAe5QmtRN1Zj4K4jlhYRMLXwRR-ugYGg3PScaVKdPZKkOm_tpFj-CgG", "N", 'HELLO', 'WELCOME Applicant', "", "", "", "http://emmapi.tecpool.in:8081/static/thoughts/T835415.jpg", "9") })
    //    .post('/send', (req,res) => { require('../utilities/firebase').generateNotification("BATCH_13", "", "N", 'HELLO','WELCOME To Shikuyaa,\n This is testing notification', "", "", "", "http://emmapi.tecpool.in:8081/static/thoughts/T835415.jpg", "9") })
    // .post('/send', (req,res) => { mm.generateNotification("BATCH_1", "", "N", 'HELLO','WELCOME Student', "", "", "", "http://emmapi.tecpool.in:8081/static/thoughts/T835415.jpg", "9") })


    //.post('/getDelete',require('../services/BatchScheduling/batchSchedule').delete)

    // .use('/faq', require('./faq'))
    // .use('/faqHead', require('./faqHead'))
    // .use('/faqResponse', require('./faqResponse'))
    // .use('/upload/homePageBanner', formidable({
    //     uploadDir: 'uploads/homePageBanner'
    // }))
    .post('/api/upload/homePageBanner', globalService.uploadImagehomePageBanner)
    .use('/api/reports',require('./reports'))
    .use('/api/amulyaNew',require('./amulyaNew'))



module.exports = router;
