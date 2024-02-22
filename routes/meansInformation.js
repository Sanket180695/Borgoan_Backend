const express = require('express');
const router = express.Router();
const meansInformationService = require('../services/meansInformation');

router
.post('/get',meansInformationService.get)
.post('/create',meansInformationService.validate(),meansInformationService.create)
.put('/update',meansInformationService.validate(),meansInformationService.update)


module.exports = router;