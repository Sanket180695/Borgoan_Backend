const express = require('express');
const router = express.Router();
const toursAndTravelLoanService = require('../services/toursAndTravelLoan');

router
.post('/get',toursAndTravelLoanService.get)
.post('/create',toursAndTravelLoanService.validate(),toursAndTravelLoanService.create)
.put('/update',toursAndTravelLoanService.validate(),toursAndTravelLoanService.update)
.post('/addToursAndTravelsDetails',toursAndTravelLoanService.addToursAndTravelsDetails)

module.exports = router;