const express = require('express');
const router =express.Router()
const jyotimicroGuarantor = require('../services/jyotimicroGuarantor')

router
.post('/get', jyotimicroGuarantor.validate(), jyotimicroGuarantor.get)
    .post('/create',jyotimicroGuarantor.validate(), jyotimicroGuarantor.create)
    .put('/update', jyotimicroGuarantor.update)

module.exports = router