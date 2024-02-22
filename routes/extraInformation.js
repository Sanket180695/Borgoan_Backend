const express = require('express');
const router = express.Router();
const extraInformationService = require('../services/extraInformation');

router
.post('/get',extraInformationService.get)
.post('/create',extraInformationService.validate(),extraInformationService.create)
.put('/update',extraInformationService.validate(),extraInformationService.update)


module.exports = router;