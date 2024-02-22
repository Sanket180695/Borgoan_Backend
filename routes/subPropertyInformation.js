const express = require('express');
const router = express.Router();
const subpropertyInformationService = require('../services/subPropertyInformation');

router
    .post('/get', subpropertyInformationService.get)
    .post('/create', subpropertyInformationService.validate(), subpropertyInformationService.create)
    .put('/update', subpropertyInformationService.validate(), subpropertyInformationService.update)



module.exports = router;