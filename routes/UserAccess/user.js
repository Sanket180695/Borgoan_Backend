const express = require('express');
const router = express.Router();
const userService = require('../../services/UserAccess/user');


router
.post('/get',userService.get)
.post('/create',userService.validate(),userService.create)
.put('/update',userService.validate(),userService.update)
.post('/getForms',userService.getForms)
.post('/getDashboardData',userService.getDashboardData)
.post('/changePassword',userService.changePassword)
.post('/getPraposalChartData',userService.getPraposalChartData)
.post('/getDashboardCounts',userService.getDashboardCounts)
.post('/getLoanTypeLineChart',userService.getLoanTypeLineChart)
.post('/getBranchLineChart',userService.getBranchLineChart)

module.exports = router;