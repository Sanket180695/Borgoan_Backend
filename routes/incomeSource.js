const express = require('express');
const router = express.Router();
const incomeSourceService = require('../services/incomeSource');

router
.post('/get',incomeSourceService.get)
.post('/create',incomeSourceService.validate(),incomeSourceService.create)
.put('/update',incomeSourceService.validate(),incomeSourceService.update)


module.exports = router;