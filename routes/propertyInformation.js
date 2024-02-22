const express = require('express');
const router = express.Router();
const propertyInformationService = require('../services/propertyInformation');

router
    .post('/get', propertyInformationService.get)
    .post('/create', propertyInformationService.validate(), propertyInformationService.create)
    .put('/update', propertyInformationService.validate(), propertyInformationService.update)
.post('/getPropertyInfo', propertyInformationService.getPropertyInfo)
    .post('/updateManually', propertyInformationService.updateManually)


module.exports = router;