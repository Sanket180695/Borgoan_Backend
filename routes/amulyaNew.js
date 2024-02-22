const express = require('express');
const router = express.Router();
const amulyaNewService = require('../services/amulyaNew');

router
    .post('/get', amulyaNewService.validate(), amulyaNewService.get)
    .post('/create',amulyaNewService.validate(), amulyaNewService.create)
    .post('/update', amulyaNewService.update)
    .post('/getCompleted', amulyaNewService.getCompleted)


module.exports = router;