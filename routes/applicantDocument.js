const express = require('express');
const router = express.Router();
const applicantDocumentService = require('../services/applicantDocument');

router
    .post('/get', applicantDocumentService.get)
    .post('/create', applicantDocumentService.validate(), applicantDocumentService.create)
    .put('/update', applicantDocumentService.validateUpdate(), applicantDocumentService.update)
     .post('/addBulk',  applicantDocumentService.addBulk)
     .post('/getDocuments',  applicantDocumentService.getDocuments)
 .post('/updateDocument',  applicantDocumentService.updateDocument)

     
     
     
     


module.exports = router;
