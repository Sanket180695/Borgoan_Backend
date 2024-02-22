const express = require('express');
const router = express.Router();
const industryCodeService = require('../services/industryCode');

router
.post('/get',industryCodeService.get)
.post('/create',industryCodeService.validate(),industryCodeService.create)
.put('/update',industryCodeService.validate(),industryCodeService.update)


module.exports = router;