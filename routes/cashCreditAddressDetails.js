const express = require('express');
const router = express.Router();
const cashCreditAddressDetailsService = require('../services/cashCreditAddressDetails');

router
    .post('/get', cashCreditAddressDetailsService.get)
    .post('/create', cashCreditAddressDetailsService.validate(), cashCreditAddressDetailsService.create)
    .put('/update', cashCreditAddressDetailsService.validate(), cashCreditAddressDetailsService.update)
    .post('/getAddress', cashCreditAddressDetailsService.getAddress)


module.exports = router;