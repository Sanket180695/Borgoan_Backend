
const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var financialInformation = "financial_information";
var viewFinancialInformation = "view_" + financialInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        IS_INCOME_TAX_FILED: req.body.IS_INCOME_TAX_FILED ? '1' : '0',
        FINANCIAL_YEAR: req.body.FINANCIAL_YEAR,
        INCOME_AMOUNT: req.body.INCOME_AMOUNT ? req.body.INCOME_AMOUNT : 0,
        TAX_PAID_AMOUNT: req.body.TAX_PAID_AMOUNT ? req.body.TAX_PAID_AMOUNT : 0,
        AGRICULTURE_INCOME: req.body.AGRICULTURE_INCOME ? req.body.AGRICULTURE_INCOME : 0,
        OTHER_INCOME: req.body.OTHER_INCOME ? req.body.OTHER_INCOME : 0,
        MONTHLY_HOUSEHOLD_EXPENSES: req.body.MONTHLY_HOUSEHOLD_EXPENSES ? req.body.MONTHLY_HOUSEHOLD_EXPENSES : 0,
        IS_PIGMY: req.body.IS_PIGMY ? '1' : '0',
        BANK_NAME: req.body.BANK_NAME,
        DAILY_PIGMY_AMOUNT: req.body.DAILY_PIGMY_AMOUNT ? req.body.DAILY_PIGMY_AMOUNT : 0,
        PIGMY_BALANCE: req.body.PIGMY_BALANCE ? req.body.PIGMY_BALANCE : 0,

        CLIENT_ID: req.body.CLIENT_ID,
        TYPE: req.body.TYPE ? req.body.TYPE : '',
        APPLICANT_ID: req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0,

        CC_LOAN_TERNOVER: req.body.CC_LOAN_TERNOVER,
        INCOME_SOURCE_AMOUNT: req.body.INCOME_SOURCE_AMOUNT,
        YEARLY_INCOME: req.body.YEARLY_INCOME,
        SAVING_ACCOUNT_NO: req.body.SAVING_ACCOUNT_NO,
        SAVING_AMOUNT: req.body.SAVING_AMOUNT,
        OTHER_DEPOSIT_ACC_NO: req.body.OTHER_DEPOSIT_ACC_NO,
        BALANCE_AMOUNT: req.body.BALANCE_AMOUNT,
        ACCOUNT_NO: req.body.ACCOUNT_NO,
        ACCOUNT_BALANCE: req.body.ACCOUNT_BALANCE,
        LOAN_TAKEN_YEARS: req.body.LOAN_TAKEN_YEARS,
        OTHER_DEPOSIT_ACC_NO2: req.body.OTHER_DEPOSIT_ACC_NO2,
        BALANCE_AMOUNT2: req.body.BALANCE_AMOUNT2,


        SHARE_ACCOUNT_NO: req.body.SHARE_ACCOUNT_NO,
        PERIODS: req.body.PERIODS,
        TYPE_OF_ACCOUNT: req.body.TYPE_OF_ACCOUNT,
        IS_PAY_SALES_TAX_FILED: req.body.IS_PAY_SALES_TAX_FILED ? '1' : '0',
        FINANCIAL_YEAR_SALES_TAX: req.body.FINANCIAL_YEAR_SALES_TAX ? req.body.FINANCIAL_YEAR_SALES_TAX  : '0',
        SALES_TAX_PAID_AMOUNT: req.body.SALES_TAX_PAID_AMOUNT ? req.body.SALES_TAX_PAID_AMOUNT : '0',
        IS_HAVE_TERM_DEPOSIT: req.body.IS_HAVE_TERM_DEPOSIT ? '1' : '0',
        IS_HAVE_CURRENT_DEPOSIT: req.body.IS_HAVE_CURRENT_DEPOSIT ? '1' : '0',
        IS_HAVE_RECURRING_DEPOSIT: req.body.IS_HAVE_RECURRING_DEPOSIT ? '1' : '0',
        IS_HAVE_DEPOSIT: req.body.IS_HAVE_DEPOSIT ? '1' : '0'

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt().optional(),
        body('IS_INCOME_TAX_FILED').optional().toInt().isInt(),
        body('FINANCIAL_YEAR').optional(),
        body('INCOME_AMOUNT').isDecimal().optional(),
        body('TAX_PAID_AMOUNT').isDecimal().optional(),
        body('AGRICULTURE_INCOME').isDecimal().optional(),
        body('OTHER_INCOME').isDecimal().optional(),
        body('MONTHLY_HOUSEHOLD_EXPENSES').isDecimal().optional(),
        body('BANK_NAME').optional(),
        body('DAILY_PIGMY_AMOUNT').isDecimal().optional(),
        body('PIGMY_BALANCE').isDecimal().optional(),
        body('ID').optional(),
        body('IS_PIGMY').optional().toInt().isInt(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewFinancialInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get financialInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewFinancialInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get financialInformation information."
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
            mm.executeQueryData('INSERT INTO ' + financialInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save financialInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "FinancialInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + financialInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update financialInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "FinancialInformation information updated successfully...",
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


exports.getFinancialInfo = (req, res) => {
    try {

        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportkey'];
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0;

        if (PROPOSAL_ID) {
            var query = `SET SESSION group_concat_max_len = 4000000;
            SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('SHARE_ACCOUNT_NO',SHARE_ACCOUNT_NO,'PERIODS',PERIODS,'TYPE_OF_ACCOUNT',TYPE_OF_ACCOUNT,'IS_PAY_SALES_TAX_FILED',IS_PAY_SALES_TAX_FILED,'FINANCIAL_YEAR_SALES_TAX',FINANCIAL_YEAR_SALES_TAX,'SALES_TAX_PAID_AMOUNT',SALES_TAX_PAID_AMOUNT,'IS_HAVE_TERM_DEPOSIT',IS_HAVE_TERM_DEPOSIT,'IS_HAVE_CURRENT_DEPOSIT',IS_HAVE_CURRENT_DEPOSIT,'IS_HAVE_RECURRING_DEPOSIT',IS_HAVE_RECURRING_DEPOSIT,'IS_HAVE_DEPOSIT',IS_HAVE_DEPOSIT,'BALANCE_AMOUNT2',BALANCE_AMOUNT2,'OTHER_DEPOSIT_ACC_NO2',OTHER_DEPOSIT_ACC_NO2,'ACCOUNT_NO',ACCOUNT_NO,'ACCOUNT_BALANCE',ACCOUNT_BALANCE,'LOAN_TAKEN_YEARS',LOAN_TAKEN_YEARS,'CC_LOAN_TERNOVER',CC_LOAN_TERNOVER,'INCOME_SOURCE_AMOUNT',INCOME_SOURCE_AMOUNT,'YEARLY_INCOME',YEARLY_INCOME,'SAVING_ACCOUNT_NO',SAVING_ACCOUNT_NO,'SAVING_AMOUNT',SAVING_AMOUNT,'OTHER_DEPOSIT_ACC_NO',OTHER_DEPOSIT_ACC_NO,'BALANCE_AMOUNT',BALANCE_AMOUNT,'ID',ID,'PROPOSAL_ID',PROPOSAL_ID,'IS_INCOME_TAX_FILED',IS_INCOME_TAX_FILED,'FINANCIAL_YEAR',FINANCIAL_YEAR,'INCOME_AMOUNT',INCOME_AMOUNT,'TAX_PAID_AMOUNT',TAX_PAID_AMOUNT,'AGRICULTURE_INCOME',AGRICULTURE_INCOME,'OTHER_INCOME',OTHER_INCOME,'MONTHLY_HOUSEHOLD_EXPENSES',MONTHLY_HOUSEHOLD_EXPENSES,'IS_PIGMY',IS_PIGMY,'BANK_NAME',BANK_NAME,'PIGMY_BALANCE',PIGMY_BALANCE,'DAILY_PIGMY_AMOUNT',DAILY_PIGMY_AMOUNT,'CLIENT_ID',CLIENT_ID,'LAST_3_YEAR_INFORMATION',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FINANCIAL_INFORMATION_ID',FINANCIAL_INFORMATION_ID,'TYPE',TYPE,'FINANCIAL_YEAR',FINANCIAL_YEAR,'INCOME_AMOUNT',INCOME_AMOUNT
,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data1 FROM view_last_3_year_information where FINANCIAL_INFORMATION_ID = m.ID),'[]'),
'TERM_DEPOSIT',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FINANCIAL_INFORMATION_ID',FINANCIAL_INFORMATION_ID,'DEPOSIT_TYPE',DEPOSIT_TYPE,'IS_HAVE_DEPOSIT',IS_HAVE_DEPOSIT,'ACC_NO',ACC_NO,'ACC_AMOUNT',ACC_AMOUNT,'MATURITY_DUE',MATURITY_DUE
,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data1 FROM view_financial_deposit_information where DEPOSIT_TYPE = 'T' and FINANCIAL_INFORMATION_ID = m.ID),'[]'),
'RECURING_DEPOSIT',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FINANCIAL_INFORMATION_ID',FINANCIAL_INFORMATION_ID,'DEPOSIT_TYPE',DEPOSIT_TYPE,'IS_HAVE_DEPOSIT',IS_HAVE_DEPOSIT,'ACC_NO',ACC_NO,'ACC_AMOUNT',ACC_AMOUNT,'MATURITY_DUE',MATURITY_DUE
,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data1 FROM view_financial_deposit_information where DEPOSIT_TYPE = 'R' and FINANCIAL_INFORMATION_ID = m.ID),'[]'),
'CURRENT_DEPOSIT',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FINANCIAL_INFORMATION_ID',FINANCIAL_INFORMATION_ID,'DEPOSIT_TYPE',DEPOSIT_TYPE,'IS_HAVE_DEPOSIT',IS_HAVE_DEPOSIT,'ACC_NO',ACC_NO,'ACC_AMOUNT',ACC_AMOUNT,'MATURITY_DUE',MATURITY_DUE
,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data1 FROM view_financial_deposit_information where DEPOSIT_TYPE = 'C' and FINANCIAL_INFORMATION_ID = m.ID),'[]')
)),']'),'"[','['),']"',']') as data FROM view_financial_information m  where PROPOSAL_ID = ${PROPOSAL_ID} AND TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``);


            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get all property information."
                    });
                }
                else {
                    var json = results[1][0].data;
                    if (json)
                        json = json.replace(/\\/g, '');
                    console.log(json);
                    res.send({
                        code: 200,
                        message: "success",
                        data: JSON.parse(json)
                    });
                }
            });
        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter Missing - ProposalId"
            });

        }
    } catch (error) {
        console.log(error)
    }
}




var async = require('async');

exports.updateFinancialInfo = (req, res) => {
    try {
        console.log(req.body)
        var data = reqData(req);
        data.IS_INCOME_TAX_FILED = req.body.IS_INCOME_TAX_FILED ? '1' : '0';
        data.IS_PIGMY = req.body.IS_PIGMY ? '1' : '0';

        var supportKey = req.headers['supportkey'];

        var LAST_3_YEAR_INFORMATION = req.body.LAST_3_YEAR_INFORMATION;
        var TERM_DEPOSIT = req.body.TERM_DEPOSIT;
        var RECURING_DEPOSIT = req.body.RECURING_DEPOSIT;
        var CURRENT_DEPOSIT = req.body.CURRENT_DEPOSIT;

        if (data && LAST_3_YEAR_INFORMATION) {

            var connection = db.openConnection();
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
            try {
                mm.executeQueryData(`UPDATE ` + financialInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);

                        console.log(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to update financialInformation information."
                        });
                    }
                    else {
                        console.log(results);
                        if (LAST_3_YEAR_INFORMATION.length > 0) {

                            async.eachSeries(LAST_3_YEAR_INFORMATION, function iteratorOverElems(tableData, callback) {

                                db.executeDML(`update last_3_year_information  set INCOME_AMOUNT = ${tableData.INCOME_AMOUNT} where ID = ${tableData.ID} `, '', supportKey, connection, (error, resultsLast3YearUpdate) => {
                                    if (error) {
                                        console.log(error);
                                        callback(error);
                                    }
                                    else {
                                        callback()
                                    }
                                });
                            }, function subCb(error) {
                                if (error) {
                                    //rollback
                                    console.log(error);
                                    //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update Financial Information..."
                                    });
                                } else {

                                    db.executeDML(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 4 ` + (data.TYPE != 'B' ? `AND APPLICANT_ID = ${data.APPLICANT_ID}` : ``) + ` AND TYPE = '${data.TYPE}'`, '', supportKey, connection, (error, resultsUpdate) => {
                                        if (error) {
                                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                            console.log(error);
                                            db.rollbackConnection(connection);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Financial Information."
                                            });
                                        }
                                        else {
                                            updateFinancialInformation(RECURING_DEPOSIT, CURRENT_DEPOSIT, TERM_DEPOSIT, supportKey, criteria.ID, res, connection)

                                            // db.commitConnection(connection);
                                            // res.send({
                                            //     "code": 200,
                                            //     "message": "FinancialInformation updated successfully...",
                                            // });

                                        }
                                    });
                                }
                            });
                        }
                        else {
                            db.executeDML(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 4 ` + (data.TYPE != 'B' ? `AND APPLICANT_ID = ${data.APPLICANT_ID}` : ``) + ` AND TYPE = '${data.TYPE}'`, '', supportKey, connection, (error, resultsUpdate) => {
                                if (error) {
                                    //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    console.log(error);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update Financial Information."
                                    });
                                }
                                else {
                                    updateFinancialInformation(RECURING_DEPOSIT, CURRENT_DEPOSIT, TERM_DEPOSIT, supportKey,  criteria.ID, res, connection)

                                    // db.commitConnection(connection);
                                    // res.send({
                                    //     "code": 200,
                                    //     "message": "FinancialInformation updated successfully...",
                                    // });

                                }
                            });
                        }

                    }
                });
            } catch (error) {
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                console.log(error);
            }
        }
        else {
            res.send({
                "code": 400,
                "message": "parameter missing-LAST_3_YEAR_INFORMATION,data ",
            });
        }
    } catch (error) {
        console.log(error)
    }
}


function updateFinancialInformation(RECURING_DEPOSIT, CURRENT_DEPOSIT, TERM_DEPOSIT, supportKey, FINANCIAL_INFORMATION_ID, res, con) {
    try {

        var recordArry = [...RECURING_DEPOSIT, ...CURRENT_DEPOSIT, ...TERM_DEPOSIT]

        var insertQuery = `insert into financial_deposit_information(FINANCIAL_INFORMATION_ID,DEPOSIT_TYPE,IS_HAVE_DEPOSIT,ACC_NO,ACC_AMOUNT,MATURITY_DUE,CLIENT_ID) values ? `;
        var recordData = [];
        for (let i = 0; i < recordArry.length; i++) {
            const rItem = recordArry[i];

            recordData.push([FINANCIAL_INFORMATION_ID, rItem.DEPOSIT_TYPE, rItem.IS_HAVE_DEPOSIT, rItem.ACC_NO, rItem.ACC_AMOUNT, rItem.MATURITY_DUE,1])

        }
			if(recordData.length > 0){
        db.executeDML(`DELETE FROM financial_deposit_information WHERE FINANCIAL_INFORMATION_ID = ${FINANCIAL_INFORMATION_ID}`, '', supportKey, con, (error, resultsUpdate) => {
            if (error) {
                //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                console.log(error);
                db.rollbackConnection(con);
                res.send({
                    "code": 400,
                    "message": "Failed to update Financial Information."
                });
            }
            else {

                db.executeDML(insertQuery, [recordData], supportKey, con, (error, resultsUpdate1) => {
                    if (error) {
                        //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(con);
                        res.send({
                            "code": 400,
                            "message": "Failed to update Financial Information."
                        });
                    }
                    else {

                        db.commitConnection(con);
                        res.send({
                            "code": 200,
                            "message": "FinancialInformation updated successfully...",
                        });

                    }
                });
            }
        });
			}
			else
				{
					db.commitConnection(con);
                        res.send({
                            "code": 200,
                            "message": "FinancialInformation updated successfully...",
                        });
				}
    } catch (error) {
        console.log(error);
        db.rollbackConnection(con);
        res.send({
            "code": 400,
            "message": "Failed to update Financial Information."
        });
    }
}



