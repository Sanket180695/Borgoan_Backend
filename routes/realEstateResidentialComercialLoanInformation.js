const express = require('express');
const router = express.Router();
const realEstateResidentialComercialLoanInformationService = require('../services/realEstateResidentialComercialLoanInformation');

router
.post('/get',realEstateResidentialComercialLoanInformationService.get)
.post('/create',realEstateResidentialComercialLoanInformationService.validate(),realEstateResidentialComercialLoanInformationService.create)
.put('/update',realEstateResidentialComercialLoanInformationService.validate(),realEstateResidentialComercialLoanInformationService.update)


module.exports = router;