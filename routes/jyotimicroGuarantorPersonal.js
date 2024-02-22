const express = require('express');
const router = express.Router();
const jyotimicroGuarantorPersonalService = require('../services/jyotimicroGuarantorPersonal');


router
    .post('/get', jyotimicroGuarantorPersonalService.validate(), jyotimicroGuarantorPersonalService.get)
    .post('/create',jyotimicroGuarantorPersonalService.validate(), jyotimicroGuarantorPersonalService.create)
    .put('/update', jyotimicroGuarantorPersonalService.update)

module.exports = router;