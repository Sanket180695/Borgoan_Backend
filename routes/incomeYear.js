const express = require('express');
const router = express.Router();
const incomeyearService = require('../services/incomeYear');

router
.post('/get',incomeyearService.get)
.post('/create',incomeyearService.validate(),incomeyearService.create)
.put('/update',incomeyearService.validate(),incomeyearService.update)


module.exports = router;