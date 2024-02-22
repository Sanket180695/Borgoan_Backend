const express = require('express');
const router = express.Router();
const managementOfSalesInformationService = require('../services/managementOfSalesInformation');

router
.post('/get',managementOfSalesInformationService.get)
.post('/create',managementOfSalesInformationService.validate(),managementOfSalesInformationService.create)
.put('/update',managementOfSalesInformationService.validate(),managementOfSalesInformationService.update)
.post('/getManagementOfSalesInfo',managementOfSalesInformationService.getManagementOfSalesInfo)

module.exports = router;