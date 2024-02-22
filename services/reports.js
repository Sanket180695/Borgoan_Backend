const { body } = require('express-validator');
const mm = require('../utilities/globalModule');


const reportsMaster = "reports_master";
const ViewReportsMaster = "view_" + reportsMaster;

exports.validate = function () {

    return [
        body('TABLE_NAME').exists,
        body('SORT_KEY').exists,
        body('SORT_VALUE').exists,
        body('DATE_FEILD').exists,
        body('START_DATE').exists,
        body('END_DATE').exists
    ]
}

function reqData(req) {
    let data = {
        NAME: req.body.NAME,
        NAME_EN: req.body.NAME_EN,
        NAME_KN: req.body.NAME_KN,
        IS_ACTIVE: req.body.IS_ACTIVE,
        FLAG: req.body.FLAG
    }
    return data
}

exports.get = (req, res) => {
    let supportKey = req.headers['supportkey'];
    let query = `select * from ${ViewReportsMaster} where 1 AND IS_ACTIVE = 1`
    mm.executeQueryData(query, '', supportKey, (error, results) => {
        if (error) {
            console.log("error", error);
            res.send({
                "code": 400,
                "message": "Failed to get reports"
            })
        }
        else {
            res.send({
                "code": 200,
                "message": "SUCCESS",
                "data": results
            })
        }
    })
}


exports.create = (req, res) => {
    let supportKey = req.headers['supportKey'];
    let query = `insert into ${reportsMaster} set ?`
    let data = reqData(req);
    mm.executeQueryData(query, data, supportKey, (error) => {
        if (error) {
            console.log("error", error);
            res.send({
                "code": 200,
                "message": "Faild to create reports"
            })
        }
        else {
            res.send({
                "code": 200,
                "message": "success"
            })
        }
    })
}


exports.getReport = (req, res) => {
    let supportKey = req.headers['supportkey']

    let pageIndex = req.body.pageIndex ? req.body.pageIndex : ``;
    let pageSize = req.body.pageSize ? req.body.pageSize : ``;
    let sortKey = req.body.sortKey ? req.body.sortKey : `ID`;
    let sortValue = req.body.sortValue ? req.body.sortValue : `DESC`;
    let filter = req.body.filter ? req.body.filter : ``
    let criteria = ``;

    let start = 0;
    let end = 0
    console.log("req", req);
    if (pageIndex != `` && pageSize != ``) {
        start = (pageIndex - 1) * pageSize;
        end = pageSize;
        console.log(start + " " + end);
    }
    let countCriteria = ``


    if (pageIndex != '' && pageSize != '') {

        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;;
        countCriteria = filter + " order by " + sortKey + " " + sortValue
    }
    else {


        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;
        countCriteria = filter + " order by " + sortKey + " " + sortValue

    }





    let query = `select * from view_praposal_master where 1 ` + criteria;
    let countQuery = `select count(*) as cnt from view_praposal_master where 1 ` + countCriteria;
    let querywithoutlimit = `select * from view_praposal_master where 1`+ filter

    console.log('query', query);

   mm.executeQueryData(querywithoutlimit, '', supportKey , (error, allData)=>{
    if(error){
        res.send({
            "code": 400,
            "err": error
        })

    }
    else{
        mm.executeQueryData(countQuery, '', supportKey, (error, countResult) => {
            if (error) {
                console.log("error", error);
                res.send({
                    "code": 400,
                    "message": "Failed "
                })
            }
            else {
                mm.executeQueryData(query, '', supportKey, (error, result) => {
                    if (error) {
                        console.log("error", error);
                        res.send({
                            "code": 400,
                            "message": "failed"
                        })
                    }
                    else {
                        res.send({
                            "code": 200,
                            "message": "SUCCESS",
                            "count": countResult[0].cnt,
                            "data": result,
                            "allData": allData
                        })
                    }
    
                })
            }
        })
    }
   })








}