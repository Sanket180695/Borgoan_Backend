const express = require('express');
const router = express.Router();
const factoryUnitInformationService = require('../services/factoryUnitInformation');

router
.post('/get',factoryUnitInformationService.get)
.post('/create',factoryUnitInformationService.validate(),factoryUnitInformationService.create)
.put('/update',factoryUnitInformationService.validate(),factoryUnitInformationService.update)


module.exports = router;