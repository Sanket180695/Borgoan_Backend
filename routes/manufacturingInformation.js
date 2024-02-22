const express = require('express');
const router = express.Router();
const manufacturingInformationService = require('../services/manufacturingInformation');

router
.post('/get',manufacturingInformationService.get)
.post('/create',manufacturingInformationService.validate(),manufacturingInformationService.create)
.put('/update',manufacturingInformationService.validate(),manufacturingInformationService.update)


module.exports = router;