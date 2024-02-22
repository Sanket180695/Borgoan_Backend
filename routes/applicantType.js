const express = require('express');
const router = express.Router();
const applicantTypeService = require('../services/applicantType');

router
.post('/get',applicantTypeService.get)
.post('/create',applicantTypeService.validate(),applicantTypeService.create)
.put('/update',applicantTypeService.validate(),applicantTypeService.update)


module.exports = router;
