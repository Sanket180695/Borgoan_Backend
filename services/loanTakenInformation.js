const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var loanTakenInformation = "loan_taken_information";
var viewLoanTakenInformation = "view_" + loanTakenInformation;


function reqData(req) {

    var data = {
        CREDIT_INFORMATION_ID: req.body.CREDIT_INFORMATION_ID,
        BANK_OR_INSTITUTE_NAME: req.body.BANK_OR_INSTITUTE_NAME,
        BRANCH_NAME: req.body.BRANCH_NAME,
        LOAN_TYPE_ID: req.body.LOAN_TYPE_ID,
        SANCTIONED_AMOUNT: req.body.SANCTIONED_AMOUNT ? req.body.SANCTIONED_AMOUNT : 0,
        INSTALLMENT_AMOUNT: req.body.INSTALLMENT_AMOUNT ? req.body.INSTALLMENT_AMOUNT : 0,
        LOAN_OUTSTANDING: req.body.LOAN_OUTSTANDING ? req.body.LOAN_OUTSTANDING : 0,
        LOAN_OVERDUE_AMOUNT: req.body.LOAN_OVERDUE_AMOUNT ? req.body.LOAN_OVERDUE_AMOUNT : 0,
        DUE_DATE: req.body.DUE_DATE,
        SECURITY_OFFERED: req.body.SECURITY_OFFERED,
        IS_SUB: req.body.IS_SUB ? '1' : '0',

        CLIENT_ID: req.body.CLIENT_ID,
        ACCOUNT_NUMBER: req.body.ACCOUNT_NUMBER,
        IS_SELECTED: req.body.IS_SELECTED ? '1' : '0',
        ARCHIVE_FLAG: req.body.ARCHIVE_FLAG ? req.body.ARCHIVE_FLAG : 'F',
       SANCTION_DATE: req.body.SANCTION_DATE,
        REMARK: req.body.REMARK,
 YEAR: req.body.YEAR,
REPAYMENT_DATE: req.body.REPAYMENT_DATE,
LOAN_TYPE: req.body.LOAN_TYPE
    }
    return data;
}



exports.validate = function () {
    return [

        body('CREADIT_INFORMATION_ID').isInt().optional(), body('BANK_OR_INSTITUTE_NAME').optional(), body('BRANCH_NAME').optional(), body('LOAN_TYPE_ID').isInt().optional(), body('SANCTIONED_AMOUNT').isDecimal().optional(), body('INSTALLMENT_AMOUNT').isDecimal().optional(), body('LOAN_OUTSTANDING').isDecimal().optional(), body('LOAN_OVERDUE_AMOUNT').isDecimal().optional(), body('DUE_DATE').optional(), body('SECURITY_OFFERED').optional(), body('IS_SUB').optional(), body('ID').optional(),


    ]
}


exports.get = (req, res) => {

    var pageIndex = req.body.pageIndex ? req.body.pageIndex : '';

    var pageSize = req.body.pageSize ? req.body.pageSize : '';
    var start = 0;
    var end = 0;

    console.log(pageIndex + " " + pageSize)
    if (pageIndex != '' && pageSize != '') {
        start = (pageIndex - 1) * pageSize;
        end = pageSize;
        console.log(start + " " + end);
    }

    let sortKey = req.body.sortKey ? req.body.sortKey : 'ID';
    let sortValue = req.body.sortValue ? req.body.sortValue : 'DESC';
    let filter = req.body.filter ? req.body.filter : '';

    let criteria = '';

    if (pageIndex === '' && pageSize === '')
        criteria = filter + " order by " + sortKey + " " + sortValue;
    else
        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;

    let countCriteria = filter;
    var supportKey = req.headers['supportkey'];
    try {
        mm.executeQuery('select count(*) as cnt from ' + viewLoanTakenInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get loanTakenInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewLoanTakenInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get loanTakenInformation information."
                        });
                    }
                    else {

                        console.log(results);
                        res.send({
                            "code": 200,
                            "message": "success",
                            "count": results1[0].cnt,
                            "data": results
                        });
                    }
                });
            }
        });
    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        console.log(error);
    }

}


exports.create = (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);
    var supportKey = req.headers['supportkey'];

    if (!errors.isEmpty()) {

        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    }
    else {
        try {
            mm.executeQueryData('INSERT INTO ' + loanTakenInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save loanTakenInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "LoanTakenInformation information saved successfully...",
                        "data": [{
                            ID: results.insertId
                        }]
                    });
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error)
        }
    }
}





exports.update = (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    var data = reqData(req);
    var supportKey = req.headers['supportkey'];
    var criteria = {
        ID: req.body.ID,
    };
    var systemDate = mm.getSystemDate();
    var setData = "";
    var recordData = [];
    Object.keys(data).forEach(key => {

        //data[key] ? setData += `${key}= '${data[key]}', ` : true;
        // setData += `${key}= :"${key}", `;
        data[key] ? setData += `${key}= ? , ` : true;
        data[key] ? recordData.push(data[key]) : true;
    });

    if (!errors.isEmpty()) {
        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    }
    else {
        try {
            mm.executeQueryData(`UPDATE ` + loanTakenInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update loanTakenInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "LoanTakenInformation information updated successfully...",
                    });
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
        }
    }
}
