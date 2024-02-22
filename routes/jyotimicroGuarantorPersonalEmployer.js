const express = require('express');
const router =express.Router()
const jyotimicroGuarantorPersonalEmployer = require('../services/jyotimicroGuarantorPersonalEmployer')

router
    .post('/get', jyotimicroGuarantorPersonalEmployer.validate(), jyotimicroGuarantorPersonalEmployer.get)
    .post('/create',jyotimicroGuarantorPersonalEmployer.validate(), jyotimicroGuarantorPersonalEmployer.create)
    .put('/update', jyotimicroGuarantorPersonalEmployer.update)


module.exports = router