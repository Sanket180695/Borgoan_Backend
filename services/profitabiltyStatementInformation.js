const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var profitabiltyStatementInformation = "profitabilty_statement_information";
var viewProfitabiltyStatementInformation = "view_" + profitabiltyStatementInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        CAPACITY_UTILITY: req.body.CAPACITY_UTILITY ? req.body.CAPACITY_UTILITY : 0,
        GROSS_RECEIPTS: req.body.GROSS_RECEIPTS ? req.body.GROSS_RECEIPTS : 0,
        RM_PURCHASES: req.body.RM_PURCHASES ? req.body.RM_PURCHASES : 0,
        DIRECT_EXPENSES: req.body.DIRECT_EXPENSES ? req.body.DIRECT_EXPENSES : 0,
        INDIRECT_EXPENSES: req.body.INDIRECT_EXPENSES ? req.body.INDIRECT_EXPENSES : 0,
        INTEREST_TERM_LOAN: req.body.INTEREST_TERM_LOAN ? req.body.INTEREST_TERM_LOAN : 0,
        INTEREST_CASH_CREDIT: req.body.INTEREST_CASH_CREDIT ? req.body.INTEREST_CASH_CREDIT : 0,
        INTEREST_OTHER: req.body.INTEREST_OTHER ? req.body.INTEREST_OTHER : 0,
        DEPRECIATION: req.body.DEPRECIATION ? req.body.DEPRECIATION : 0,
        REMU_TO_PARTNERS: req.body.REMU_TO_PARTNERS ? req.body.REMU_TO_PARTNERS : 0,
        INTEREST_ON_CAPITAL: req.body.INTEREST_ON_CAPITAL ? req.body.INTEREST_ON_CAPITAL : 0,
        OTHERS: req.body.OTHERS ? req.body.OTHERS : 0,
        PROFIT_BEFORE_TAX: req.body.PROFIT_BEFORE_TAX ? req.body.PROFIT_BEFORE_TAX : 0,
        LESS_TAX: req.body.LESS_TAX ? req.body.LESS_TAX : 0,
        PROFIT_AFTER_TAX: req.body.PROFIT_AFTER_TAX ? req.body.PROFIT_AFTER_TAX : 0,
        ADD_BACK_DEPRECIATION: req.body.ADD_BACK_DEPRECIATION ? req.body.ADD_BACK_DEPRECIATION : 0,
        OPERATING_PROFIT: req.body.OPERATING_PROFIT ? req.body.OPERATING_PROFIT : 0,
        YEAR: req.body.YEAR,
        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('CAPACITY_UTILITY').isDecimal().optional(), body('GROSS_RECEIPTS').isDecimal().optional(), body('RM_PURCHASES').isDecimal().optional(), body('DIRECT_EXPENSES').isDecimal().optional(), body('INDIRECT_EXPENSES').isDecimal().optional(), body('INTEREST_TERM_LOAN').isDecimal().optional(), body('INTEREST_CASH_CREDIT').isDecimal().optional(), body('INTEREST_OTHER').isDecimal().optional(), body('DEPRECIATION').isDecimal().optional(), body('REMU_TO_PARTNERS').isDecimal().optional(), body('INTEREST_ON_CAPITAL').isDecimal().optional(), body('OTHERS').isDecimal().optional(), body('PROFIT_BEFORE_TAX').isDecimal().optional(), body('LESS_TAX').isDecimal().optional(), body('PROFIT_AFTER_TAX').isDecimal().optional(), body('ADD_BACK_DEPRECIATION').isDecimal().optional(), body('OPERATING_PROFIT').isDecimal().optional(), body('YEAR', ' parameter missing').exists(), body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewProfitabiltyStatementInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get profitabiltyStatementInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewProfitabiltyStatementInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get profitabiltyStatementInformation information."
                        });
                    }
                    else {


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
            mm.executeQueryData('INSERT INTO ' + profitabiltyStatementInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save profitabiltyStatementInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ProfitabiltyStatementInformation information saved successfully...",
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
    //console.log(req.body);
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
            mm.executeQueryData(`UPDATE ` + profitabiltyStatementInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update profitabiltyStatementInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ProfitabiltyStatementInformation information updated successfully...",
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