const express = require('express');
const router = express.Router();
const documentGroupService = require('../services/documentGroup');

router
.post('/get',documentGroupService.get)
.post('/create',documentGroupService.validate(),documentGroupService.create)
.put('/update',documentGroupService.validate(),documentGroupService.update)
.post('/getDocumentsMultiselect',documentGroupService.getDocumentsMultiselect)

module.exports = router;
