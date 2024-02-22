const express = require('express');
const router = express.Router();
const homePageBannerService = require('../services/homePageBanner');

router
    .post('/get', homePageBannerService.get)
    .post('/create', homePageBannerService.validate(), homePageBannerService.create)
    .put('/update', homePageBannerService.validate(), homePageBannerService.update)


module.exports = router;
