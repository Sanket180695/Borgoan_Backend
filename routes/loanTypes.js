const express = require('express');
const router = express.Router();
const loanTypesService = require('../services/loanTypes');

router
    .post('/get', loanTypesService.get)
    .post('/create', loanTypesService.validate(), loanTypesService.create)
    .put('/update', loanTypesService.validate(), loanTypesService.update)


module.exports = router;
