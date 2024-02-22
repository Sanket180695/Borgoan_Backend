const express = require('express');
const router = express.Router();
const vehicleLoanService = require('../services/vehicleLoan');

router
.post('/get',vehicleLoanService.get)
.post('/create',vehicleLoanService.validate(),vehicleLoanService.create)
.put('/update',vehicleLoanService.validate(),vehicleLoanService.update)


module.exports = router;