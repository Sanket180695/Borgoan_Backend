const express = require('express');
const router =express.Router()
const jyotimicroGuarantorAddress = require('../services/jyotimicroGuarantorAddress')

router
.post('/get', jyotimicroGuarantorAddress.validate(), jyotimicroGuarantorAddress.get)
    .post('/create',jyotimicroGuarantorAddress.validate(), jyotimicroGuarantorAddress.create)
    .put('/update', jyotimicroGuarantorAddress.update)

module.exports = router