const express = require('express');
const router = express.Router();
const consumerDurablesLoansService = require('../services/consumerDurablesLoans');

router
.post('/get',consumerDurablesLoansService.get)
.post('/create',consumerDurablesLoansService.validate(),consumerDurablesLoansService.create)
.put('/update',consumerDurablesLoansService.validate(),consumerDurablesLoansService.update)


module.exports = router;