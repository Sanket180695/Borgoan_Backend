const express = require('express');
const router =express.Router()
const jyotimicroGuarantorPersonalBanker = require('../services/jyotimicroGuarantorPersonalBanker')

router
 .post('/get', jyotimicroGuarantorPersonalBanker.validate(), jyotimicroGuarantorPersonalBanker.get)
    .post('/create',jyotimicroGuarantorPersonalBanker.validate(), jyotimicroGuarantorPersonalBanker.create)
    .put('/update', jyotimicroGuarantorPersonalBanker.update)

module.exports = router