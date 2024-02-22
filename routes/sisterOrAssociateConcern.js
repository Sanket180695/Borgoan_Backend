const express = require('express');
const router = express.Router();
const sisterOrAssociateConcernService = require('../services/sisterOrAssociateConcern');

router
.post('/get',sisterOrAssociateConcernService.get)
.post('/create',sisterOrAssociateConcernService.validate(),sisterOrAssociateConcernService.create)
.put('/update',sisterOrAssociateConcernService.validate(),sisterOrAssociateConcernService.update)


module.exports = router;