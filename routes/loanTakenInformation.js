const express = require('express');
const router = express.Router();
const loanTakenInformationService = require('../services/loanTakenInformation');

router
.post('/get',loanTakenInformationService.get)
.post('/create',loanTakenInformationService.validate(),loanTakenInformationService.create)
.put('/update',loanTakenInformationService.validate(),loanTakenInformationService.update)


module.exports = router;