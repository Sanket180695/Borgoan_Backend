const express = require('express');
const router = express.Router();
const reportSchedulerService = require('../services/reportScheduler');

router
.post('/get',reportSchedulerService.get)
.post('/create',reportSchedulerService.validate(),reportSchedulerService.create)
.put('/update',reportSchedulerService.validate(),reportSchedulerService.update)
.post('/addReportSchedular',reportSchedulerService.createReportSchedular)

module.exports = router;