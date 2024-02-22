const express = require('express');
const router = express.Router();
const detailsOfEmployeeService = require('../services/detailsOfEmployee');

router
.post('/get',detailsOfEmployeeService.get)
.post('/create',detailsOfEmployeeService.validate(),detailsOfEmployeeService.create)
.put('/update',detailsOfEmployeeService.validate(),detailsOfEmployeeService.update)


module.exports = router;