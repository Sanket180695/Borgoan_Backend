const express = require('express');
const router = express.Router();
const jyotimicroGuarantorProperty = require('../services/jyotimicroGuarantorProperty');


router
.post('/get', jyotimicroGuarantorProperty.validate(), jyotimicroGuarantorProperty.get)
    .post('/create',jyotimicroGuarantorProperty.validate(), jyotimicroGuarantorProperty.create)
    .put('/update', jyotimicroGuarantorProperty.update)


module.exports = router; 