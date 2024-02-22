const express = require('express');
const router = express.Router();
const loanTypeDocumentMappingService = require('../services/loanTypeDocumentMapping');

router
    .post('/get', loanTypeDocumentMappingService.get)
    .post('/create', loanTypeDocumentMappingService.validate(), loanTypeDocumentMappingService.create)
    .put('/update', loanTypeDocumentMappingService.validate(), loanTypeDocumentMappingService.update)


module.exports = router;
