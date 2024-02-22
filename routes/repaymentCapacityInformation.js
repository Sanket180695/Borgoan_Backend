const express = require('express');
const router = express.Router();
const repaymentCapacityInformationService = require('../services/repaymentCapacityInformation');

router
.post('/get',repaymentCapacityInformationService.get)
.post('/create',repaymentCapacityInformationService.validate(),repaymentCapacityInformationService.create)
.put('/update',repaymentCapacityInformationService.validate(),repaymentCapacityInformationService.update)


module.exports = router;