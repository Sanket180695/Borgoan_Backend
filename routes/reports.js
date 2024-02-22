const express = require('express');
const router = express.Router();
const reportsService = require('../services/reports');

router
.post('/get',reportsService.get)
.post('/getReport',   reportsService.getReport)


module.exports = router

