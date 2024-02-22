const express = require('express');
const router = express.Router();
const userActivityLogService = require('../services/userActivityLog');

router
.post('/get',userActivityLogService.get)
.post('/create',userActivityLogService.validate(),userActivityLogService.create)
.put('/update',userActivityLogService.validate(),userActivityLogService.update)


module.exports = router;
