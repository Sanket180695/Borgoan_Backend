const express = require('express');
const router = express.Router();
const foreignTravelFamilyDetailService = require('../services/foreignTravelFamilyDetail');

router
.post('/get',foreignTravelFamilyDetailService.get)
.post('/create',foreignTravelFamilyDetailService.validate(),foreignTravelFamilyDetailService.create)
.put('/update',foreignTravelFamilyDetailService.validate(),foreignTravelFamilyDetailService.update)


module.exports = router;