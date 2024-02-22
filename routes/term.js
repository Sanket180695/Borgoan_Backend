const express = require('express');
const router = express.Router();
const termService = require('../services/term');

router
.post('/get',termService.get)
.post('/create',termService.validate(),termService.create)
.put('/update',termService.validate(),termService.update)


module.exports = router;