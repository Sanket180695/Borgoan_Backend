const express = require('express');
const router = express.Router();
const installmentFrequencyService = require('../services/installmentFrequency');

router
.post('/get',installmentFrequencyService.get)
.post('/create',installmentFrequencyService.validate(),installmentFrequencyService.create)
.put('/update',installmentFrequencyService.validate(),installmentFrequencyService.update)


module.exports = router;