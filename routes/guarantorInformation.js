const express = require('express');
const router = express.Router();
const guarantorInformationService = require('../services/guarantorInformation');

router
.post('/get',guarantorInformationService.get)   
.post('/create',guarantorInformationService.validate(),guarantorInformationService.create)
.put('/update',guarantorInformationService.validate(),guarantorInformationService.update)
.post('/addBulk',guarantorInformationService.addBulk)  
.post('/addGuarentor',guarantorInformationService.checkGurentorMobileNo,guarantorInformationService.addGuarentor) 
.post('/getAllInformation',guarantorInformationService.getAllGuarentorInformation)     

module.exports = router;
