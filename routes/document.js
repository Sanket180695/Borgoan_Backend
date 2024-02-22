const express = require('express');
const router = express.Router();
const documentService = require('../services/document');

router
.post('/get',documentService.get)
.post('/create',documentService.validate(),documentService.create)
.put('/update',documentService.validate(),documentService.update)


module.exports = router;
