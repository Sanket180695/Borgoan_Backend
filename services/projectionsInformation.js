const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');


const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var projectionsInformation = "projections_information";
var viewProjectionsInformation = "view_" + projectionsInformation;

function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        NOTE_TO_ACHIVE_THE_PROJECTIONS: req.body.NOTE_TO_ACHIVE_THE_PROJECTIONS,
        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('NOTE_TO_ACHIVE_THE_PROJECTIONS').optional(),
        body('ID').optional(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewProjectionsInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get projectionsInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewProjectionsInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get projectionsInformation information."
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
            mm.executeQueryData('INSERT INTO ' + projectionsInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save projectionsInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "Projections information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + projectionsInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update projectionsInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ProjectionsInformation information updated successfully...",
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

        var data1 = req.body.PROFITABILITY_STATEMENT;
        var data3 = req.body.REPAYING_CAPACITY;
        var data2 = req.body.BALANCE_SHEET_INFORMATION;
        var connection = db.openConnection();
        var PROPOSAL_ID = req.body.PROPOSAL_ID;


        if (data1 && data3 && data2) {

            db.executeDML(`DELETE FROM profitabilty_statement_information WHERE PROPOSAL_ID = ${PROPOSAL_ID}`, '', supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update guarantor Information ."
                    });

                }
                else {

                    var insertQuery = `Insert into profitabilty_statement_information(PROPOSAL_ID,CAPACITY_UTILITY,GROSS_RECEIPTS,RM_PURCHASES,DIRECT_EXPENSES,INDIRECT_EXPENSES,INTEREST_TERM_LOAN,INTEREST_CASH_CREDIT,INTEREST_OTHER,DEPRECIATION,REMU_TO_PARTNERS,INTEREST_ON_CAPITAL,OTHERS,PROFIT_BEFORE_TAX,LESS_TAX,PROFIT_AFTER_TAX,ADD_BACK_DEPRECIATION,OPERATING_PROFIT,YEAR,CLIENT_ID) values ?`

                    var recordData = []

                    for (let i = 0; i < data1.length; i++) {
                        const dataItem = data1[i];

                        var rec = [PROPOSAL_ID, dataItem.CAPACITY_UTILITY, dataItem.GROSS_RECEIPTS, dataItem.RM_PURCHASES, dataItem.DIRECT_EXPENSES, dataItem.INDIRECT_EXPENSES, dataItem.INTEREST_TERM_LOAN, dataItem.INTEREST_CASH_CREDIT, dataItem.INTEREST_OTHER, dataItem.DEPRECIATION, dataItem.REMU_TO_PARTNERS, dataItem.INTEREST_ON_CAPITAL, dataItem.OTHERS, dataItem.PROFIT_BEFORE_TAX, dataItem.LESS_TAX, dataItem.PROFIT_AFTER_TAX, dataItem.ADD_BACK_DEPRECIATION, dataItem.OPERATING_PROFIT, dataItem.YEAR, dataItem.CLIENT_ID]

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

                                    for (let i = 0; i < data2.length; i++) {
                                        const dataItem = data2[i];

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


                                            db.executeDML(`DELETE FROM repayment_capacity_information WHERE PROPOSAL_ID = ${PROPOSAL_ID}`, '', supportKey, connection, (error, results) => {
                                                if (error) {
                                                    console.log(error);
                                                    db.rollbackConnection(connection);
                                                    res.send({
                                                        "code": 400,
                                                        "message": "Failed to update guarantor Information ."
                                                    });

                                                }
                                                else {

                                                    var insertQuery = `Insert into repayment_capacity_information(PROPOSAL_ID,YEAR,NET_PROFIT,DEPRECIATION,INTEREST_ON_TL,INTEREST_ON_CC,DRAWING,TERM_LOAN_BLDG,MONTHLY_INSTALLMENT_BLDG,TERM_LOAN_MACH,MONTHLY_INSTALLMENT_MACH,INTEREST_ON_CASH_CREDIT_LIMIT,INTEREST,CLIENT_ID) values ?`

                                                    var recordData = [];

                                                    for (let i = 0; i < data3.length; i++) {
                                                        const dataItem = data3[i];

                                                        var rec = [PROPOSAL_ID, dataItem.YEAR, dataItem.NET_PROFIT, dataItem.DEPRECIATION, dataItem.INTEREST_ON_TL, dataItem.INTEREST_ON_CC, dataItem.DRAWING, dataItem.TERM_LOAN_BLDG, dataItem.MONTHLY_INSTALLMENT_BLDG, dataItem.TERM_LOAN_MACH, dataItem.MONTHLY_INSTALLMENT_MACH, dataItem.INTEREST_ON_CASH_CREDIT_LIMIT, dataItem.INTEREST, dataItem.CLIENT_ID]

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

