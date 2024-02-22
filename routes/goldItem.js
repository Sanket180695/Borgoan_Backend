const express = require('express');
const router = express.Router();
const addressInformationService = require('../services/goldItem');

router
.post('/get',addressInformationService.get)
.post('/create',addressInformationService.validate(),addressInformationService.create)
.put('/update',addressInformationService.validate(),addressInformationService.update)


module.exports = router;