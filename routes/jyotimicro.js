const express = require ('express');
const router = express.Router();
const microService = require('../services/jyotimicro')


router
    .post('/get',microService.validate(),microService.get)
    .post('/create',microService.validate(),microService.create)
    .put('/update',microService.validate(),microService.update)

module.exports = router ;
