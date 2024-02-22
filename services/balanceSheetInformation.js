const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var balanceSheetInformation = "balance_sheet_information";
var viewBalanceSheetInformation = "view_" + balanceSheetInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        YEAR: req.body.YEAR,
        FIXED_ASSETS: req.body.FIXED_ASSETS ? req.body.FIXED_ASSETS : 0,
        INVESTMENTS: req.body.INVESTMENTS ? req.body.INVESTMENTS : 0,
        STOCK: req.body.STOCK ? req.body.STOCK : 0,
        WORK_IN_PROGRESS: req.body.WORK_IN_PROGRESS ? req.body.WORK_IN_PROGRESS : 0,
        DEBTORS: req.body.DEBTORS ? req.body.DEBTORS : 0,
        CASH_AND_BANK: req.body.CASH_AND_BANK ? req.body.CASH_AND_BANK : 0,
        OTHER_ASSETS: req.body.OTHER_ASSETS ? req.body.OTHER_ASSETS : 0,
        CAPITAL: req.body.CAPITAL ? req.body.CAPITAL : 0,
        RESERVES: req.body.RESERVES,
        SUB_LOANS: req.body.SUB_LOANS,
        OTHER_LOANS: req.body.OTHER_LOANS,
        UNSECURED_LOANS: req.body.UNSECURED_LOANS,
        CREDITORS: req.body.CREDITORS,
        PROVISION: req.body.PROVISION,
        OTHER_LIABILITIES: req.body.OTHER_LIABILITIES,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROJECTIONS_INFORMATION_ID').isInt(), body('YEAR').optional(), body('FIXED_ASSETS').isDecimal().optional(), body('INVESTMENTS').isDecimal().optional(), body('STOCK').isDecimal().optional(), body('WORK_IN_PROGRESS').isDecimal().optional(), body('DEBTORS').isDecimal().optional(), body('CASH_AND_BANK').isDecimal().optional(), body('OTHER_ASSETS').isDecimal().optional(), body('CAPITAL').isDecimal().optional(), body('RESERVES').optional(), body('SUB_LOANS').optional(), body('OTHER_LOANS').optional(), body('UNSECURED_LOANS').optional(), body('CREDITORS').optional(), body('PROVISION').optional(), body('OTHER_LIABILITIES').optional(), body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewBalanceSheetInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get balanceSheetInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewBalanceSheetInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get balanceSheetInformation information."
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
            mm.executeQueryData('INSERT INTO ' + balanceSheetInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save balanceSheetInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "BalanceSheetInformation information saved successfully...",
                        "data": [{ ID: results.insertId }]
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
            mm.executeQueryData(`UPDATE ` + balanceSheetInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update balanceSheetInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "BalanceSheetInformation information updated successfully...",
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





exports.addBulk = (req, res) => {
    try {

        var supportKey = req.headers['supportkey'];

        var data = req.body.data;
        var connection = db.openConnection();
        var PROPOSAL_ID = req.body.PROPOSAL_ID;


        if (data) {

            db.executeDML(`DELETE FROM balance_sheet_information WHERE PROPOSAL_ID = ${PROPOSAL_ID}`, '', supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update guarantor Information ."
                    });

                }
                else {

                    var insertQuery = `Insert into balance_sheet_information(PROPOSAL_ID,YEAR,FIXED_ASSETS,INVESTMENTS,STOCK,WORK_IN_PROGRESS,DEBTORS,CASH_AND_BANK,OTHER_ASSETS,CAPITAL,RESERVES,SUB_LOANS,OTHER_LOANS,UNSECURED_LOANS,CREDITORS,PROVISION,OTHER_LIABILITIES,CLIENT_ID) values ?`

                    var recordData = []

                    for (let i = 0; i < data.length; i++) {
                        const dataItem = data[i];

                        var rec = [PROPOSAL_ID, dataItem.YEAR, dataItem.FIXED_ASSETS, dataItem.INVESTMENTS, dataItem.STOCK, dataItem.WORK_IN_PROGRESS, dataItem.DEBTORS, dataItem.CASH_AND_BANK, dataItem.OTHER_ASSETS, dataItem.CAPITAL, dataItem.RESERVES, dataItem.SUB_LOANS, dataItem.OTHER_LOANS, dataItem.UNSECURED_LOANS, dataItem.CREDITORS, dataItem.PROVISION, dataItem.OTHER_LIABILITIES, dataItem.CLIENT_ID]

                        recordData.push(rec);

                    }


                    db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                        if (error) {
                            console.log(error);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update balance sheet Information ."
                            });
                        }
                        else {
                            db.executeDML(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 8`, '', supportKey, connection, (error, resultsUpdate) => {
                                if (error) {
                                    //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    console.log(error);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update balance sheet"
                                    });
                                }
                                else {

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Balance sheet Information updated successfully ."
                                    });

                                }
                            });

                        }
                    });
                }
            });

        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter missing - data"
            });

        }

    } catch (error) {
        console.log(error);
    }
}
