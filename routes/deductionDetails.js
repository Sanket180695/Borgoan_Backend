const express = require('express');
const router = express.Router();
const deductionDetailsMasterService = require('../services/deductionDetails');

router
.post('/get',deductionDetailsMasterService.get)
.post('/create',deductionDetailsMasterService.validate(),deductionDetailsMasterService.create)
.put('/update',deductionDetailsMasterService.validate(),deductionDetailsMasterService.update)


module.exports = router;