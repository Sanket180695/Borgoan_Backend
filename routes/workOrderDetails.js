const express = require('express');
const router = express.Router();
const workOrderDetailsService = require('../services/workOrderDetails');

router
.post('/get',workOrderDetailsService.get)
.post('/create',workOrderDetailsService.validate(),workOrderDetailsService.create)
.put('/update',workOrderDetailsService.validate(),workOrderDetailsService.update)


module.exports = router;