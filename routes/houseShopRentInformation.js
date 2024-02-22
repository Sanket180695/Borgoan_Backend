const express = require('express');
const router = express.Router();
const houseShopRentInformationService = require('../services/houseShopRentInformation');

router
.post('/get',houseShopRentInformationService.get)
.post('/create',houseShopRentInformationService.validate(),houseShopRentInformationService.create)
.put('/update',houseShopRentInformationService.validate(),houseShopRentInformationService.update)


module.exports = router;