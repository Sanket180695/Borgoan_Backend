const express = require('express');
const router = express.Router();
const familyDetailService = require('../services/familyDetail');

router
.post('/get',familyDetailService.get)
.post('/create',familyDetailService.validate(),familyDetailService.create)
.post('/update',familyDetailService.validate(),familyDetailService.update)


module.exports = router;