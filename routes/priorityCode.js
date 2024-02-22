const express = require('express');
const router = express.Router();
const priorityCodeService = require('../services/priorityCode');

router
.post('/get',priorityCodeService.get)
.post('/create',priorityCodeService.validate(),priorityCodeService.create)
.put('/update',priorityCodeService.validate(),priorityCodeService.update)


module.exports = router;