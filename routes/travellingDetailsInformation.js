const express = require('express');
const router = express.Router();
const travellingDetailsInformationService = require('../services/travellingDetailsInformation');

router
    .post('/get', travellingDetailsInformationService.get)
    .post('/create', travellingDetailsInformationService.validate(), travellingDetailsInformationService.create)
    .put('/update', travellingDetailsInformationService.validate(), travellingDetailsInformationService.update)


module.exports = router;