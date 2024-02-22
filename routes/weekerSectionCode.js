const express = require('express');
const router = express.Router();
const weekerSectionCodeService = require('../services/weekerSectionCode');

router
.post('/get',weekerSectionCodeService.get)
.post('/create',weekerSectionCodeService.validate(),weekerSectionCodeService.create)
.put('/update',weekerSectionCodeService.validate(),weekerSectionCodeService.update)


module.exports = router;