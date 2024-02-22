const express = require('express');
const router = express.Router();
const homePageInformationService = require('../services/homePageInformation');

router
    .post('/get', homePageInformationService.get)
    .post('/create', homePageInformationService.validate(), homePageInformationService.create)
    .put('/update', homePageInformationService.validate(), homePageInformationService.update)


module.exports = router;



