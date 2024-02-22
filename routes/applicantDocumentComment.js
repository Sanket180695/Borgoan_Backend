const express = require('express');
const router = express.Router();
const applicantDocumentCommentService = require('../services/applicantDocumentComment');

router
.post('/get',applicantDocumentCommentService.get)
.post('/create',applicantDocumentCommentService.validate(),applicantDocumentCommentService.create)
.put('/update',applicantDocumentCommentService.validate(),applicantDocumentCommentService.update)


module.exports = router;
