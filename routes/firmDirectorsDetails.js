const express = require('express');
const router = express.Router();
const firmDirectorsDetailsService = require('../services/firmDirectorsDetails');

router
.post('/get',firmDirectorsDetailsService.get)
.post('/create',firmDirectorsDetailsService.validate(),firmDirectorsDetailsService.create)
.put('/update',firmDirectorsDetailsService.validate(),firmDirectorsDetailsService.update)


module.exports = router;