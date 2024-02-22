const express = require('express');
const router = express.Router();
const firmBranchesDetailsService = require('../services/firmBranchesDetails');

router
.post('/get',firmBranchesDetailsService.get)
.post('/create',firmBranchesDetailsService.validate(),firmBranchesDetailsService.create)
.put('/update',firmBranchesDetailsService.validate(),firmBranchesDetailsService.update)


module.exports = router;