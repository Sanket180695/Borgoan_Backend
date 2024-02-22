const express = require('express');
const router = express.Router();
const applicantDocumentService = require('../services/notification');

router
    .post('/get', applicantDocumentService.get)
    .post('/create', applicantDocumentService.validate(), applicantDocumentService.create)
    .put('/update', applicantDocumentService.validate(), applicantDocumentService.update)


module.exports = router;