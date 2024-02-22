const express = require('express');
const router = express.Router();
const applicantService = require('../services/applicant');

router
    .post('/get', applicantService.get)
    .post('/create', applicantService.validate(), applicantService.create)
    .put('/update', applicantService.validate(), applicantService.update)
    .post('/getDashBoardData', applicantService.getDashBoardData)
    .post('/getDetails', applicantService.getDetails)

module.exports = router;
