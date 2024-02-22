const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var creditInformation = "credit_information";
var viewCreditInformation = "view_" + creditInformation;


function reqData(req) {


    console.log("credit111", req.body.IS_LOAN_TAKEN_FOR_CLOSE_OTHER_LOANS, req.body.IS_EARLIAR_LOAN_HISTORY_WITH_OTHER_BANK)
    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        IS_EXISTING_LOAN_WITH_SUB: req.body.IS_EXISTING_LOAN_WITH_SUB ? '1' : '0',
        IS_EXISTING_LOAN_WITH_OTHER_BANKS: req.body.IS_EXISTING_LOAN_WITH_OTHER_BANKS ? '1' : '0',
        IS_GUARANTOR_TO_LOAN_WITH_SUB: req.body.IS_GUARANTOR_TO_LOAN_WITH_SUB ? '1' : '0',
        IS_GUARANTOR_TO_LOAN_WITH_OTHER_BANK: req.body.IS_GUARANTOR_TO_LOAN_WITH_OTHER_BANK ? '1' : '0',
        IS_EARLIAR_LOAN_HISTORY: req.body.IS_EARLIAR_LOAN_HISTORY ? '1' : '0',
        IS_EARLIAR_LOAN_HISTORY_WITH_OTHER_BANK: req.body.IS_EARLIAR_LOAN_HISTORY_WITH_OTHER_BANK ? '1' : '0',
        IS_ANY_DEPOSITES_WITH_SUB: req.body.IS_ANY_DEPOSITES_WITH_SUB ? '1' : '0',
        IS_ANY_DEPOSITES_WITH_OTHER_BANK: req.body.IS_ANY_DEPOSITES_WITH_OTHER_BANK ? '1' : '0',
        IS_LOAN_TAKEN_FOR_CLOSE_OTHER_LOANS: req.body.IS_LOAN_TAKEN_FOR_CLOSE_OTHER_LOANS ? '1' : '0',
        BANK_NAME: req.body.BANK_NAME,
        OUTSTANDING_BANK_AMOUNT: req.body.OUTSTANDING_BANK_AMOUNT ? req.body.OUTSTANDING_BANK_AMOUNT : 0,

        CLIENT_ID: req.body.CLIENT_ID,
        TYPE: req.body.TYPE ? req.body.TYPE : '',
        APPLICANT_ID: req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0,    
       OTHER_LOAN_DETAILS: req.body.OTHER_LOAN_DETAILS?req.body.OTHER_LOAN_DETAILS:'',
        LOAN_GUARENTEE_COUNT: req.body.LOAN_GUARENTEE_COUNT,
        LOAN_GUARENTEE_AMOUNT: req.body.LOAN_GUARENTEE_AMOUNT,
		IS_NOC_OBTAINED_AND_ENCLOSED: req.body.IS_NOC_OBTAINED_AND_ENCLOSED ? '1' : '0',
    }
    console.log("credit111:", data)
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('IS_EXISTING_LOAN_WITH_SUB').optional().toInt(),
        body('IS_EXISTING_LOAN_WITH_OTHER_BANKS').optional().toInt(),
        body('IS_GUARANTOR_TO_LOAN_WITH_SUB').optional().toInt(),
        body('IS_GUARANTOR_TO_LOAN_WITH_OTHER_BANK').optional().toInt(),
        body('IS_EARLIAR_LOAN_HISTORY').optional().toInt(),
        body('IS_EARLIAR_LOAN_HISTORY_WITH_OTHER_BANK').optional().toInt(),
        body('IS_ANY_DEPOSITES_WITH_OTHER_BANK').optional().toInt(),
        body('IS_ANY_DEPOSITES_WITH_SUB').optional().toInt(),
        body('IS_LOAN_TAKEN_FOR_CLOSE_OTHER_LOANS').optional().toInt(),
		 body('IS_NOC_OBTAINED_AND_ENCLOSED').optional().toInt(),
        body('BANK_NAME').optional(),
        body('OUTSTANDING_BANK_AMOUNT').isDecimal().optional(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewCreditInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get creditInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewCreditInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get creditInformation information."
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
            mm.executeQueryData('INSERT INTO ' + creditInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save creditInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "CreditInformation information saved successfully...",
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

var async = require('async');


exports.update = (req, res) => {
    const errors = validationResult(req);
    const loanTakenDetails = req.body.data;
    //console.log(req.body);
    var data = reqData(req);
    var supportKey = req.headers['supportkey'];
    var criteria = {
        ID: req.body.ID,
    };
    var systemDate = mm.getSystemDate();
    var setData = "";
    var recordData = [];
    var connection = db.openConnection();
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
            db.executeDML(`UPDATE ` + creditInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update creditInformation information."
                    });
                }
                else {

                    if (loanTakenDetails.length > 0) {
                        async.eachSeries(loanTakenDetails, function iteratorOverElems(dataRecord, callback) {


                            db.executeDML(`update loan_taken_information set IS_SELECTED = ${dataRecord.IS_SELECTED} where ID = ${dataRecord.ID}`, '', supportKey, connection, (error, resultQuestions) => {
                                if (error) {
                                    console.log(error)
                                    callback(error);
                                }
                                else {
                                    callback();
                                }
                            });

                        },
                            function subCb(error) {
                                if (error) {
                                    //rollback
                                    console.log(error);
                                    //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update Credit  Information."
                                    });
                                } else {

                                    db.executeDML(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 5 AND TYPE = '${data.TYPE}' ` + (data.TYPE != 'B' ? `AND APPLICANT_ID = ${data.APPLICANT_ID}` : ``), '', supportKey, connection, (error, resultsUpdate) => {
                                        if (error) {
                                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                            console.log(error);
                                            db.rollbackConnection(connection);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Credit  Information."
                                            });
                                        }
                                        else {

                                            deleteRecords(data, criteria.ID, connection, req, res, supportKey)
                                        }
                                    });

                                }
                            });
                    }
                    else {
                        db.executeDML(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 5 AND TYPE = '${data.TYPE}' ` + (data.TYPE != 'B' ? `AND APPLICANT_ID = ${data.APPLICANT_ID}` : ``), '', supportKey, connection, (error, resultsUpdate) => {
                            if (error) {
                                //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                console.log(error);
                                db.rollbackConnection(connection);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to update Credit  Information."
                                });
                            }
                            else {

                                deleteRecords(data, criteria.ID, connection, req, res, supportKey)
                            }
                        });
                    }
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
        }
    }
}




function deleteRecords(data, CREDIT_INFORMATION_ID, connection, req, res, supportKey) {
    try {


        var query = ``;

        if (data.IS_EXISTING_LOAN_WITH_SUB == '0') {

            query = query + `delete from loan_taken_information where IS_SUB = 1 and CREDIT_INFORMATION_ID = ${CREDIT_INFORMATION_ID};`;

        }

        if (data.IS_EXISTING_LOAN_WITH_OTHER_BANKS == '0') {

            query = query + `delete from loan_taken_information where IS_SUB = 0 and CREDIT_INFORMATION_ID = ${CREDIT_INFORMATION_ID};`;

        }

        if (data.IS_GUARANTOR_TO_LOAN_WITH_SUB == '0') {
            query = query + `delete from guarantor_for_loan where IS_SUB = 1 and CREDIT_INFORMATION_ID = ${CREDIT_INFORMATION_ID};`;
        }

        if (data.IS_GUARANTOR_TO_LOAN_WITH_OTHER_BANK == '0') {

            query = query + `delete from guarantor_for_loan where IS_SUB = 0 and CREDIT_INFORMATION_ID = ${CREDIT_INFORMATION_ID};`;

        }


        if (data.IS_EARLIAR_LOAN_HISTORY == '0') {
            query = query + `delete from earlier_loan_history where IS_SUB = 1 and CREDIT_INFORMATION_ID = ${CREDIT_INFORMATION_ID};`;
        }

        if (data.IS_EARLIAR_LOAN_HISTORY_WITH_OTHER_BANK == '0') {
            query = query + `delete from earlier_loan_history where IS_SUB = 0 and CREDIT_INFORMATION_ID = ${CREDIT_INFORMATION_ID};`;
        }
        if (data.IS_ANY_DEPOSITES_WITH_SUB == '0') {
            query = query + `delete from deposits_in_bank where IS_SUB = 1 and CREDIT_INFORMATION_ID = ${CREDIT_INFORMATION_ID};`;
        }
        if (data.IS_ANY_DEPOSITES_WITH_OTHER_BANK == '0') {
            query = query + `delete from deposits_in_bank where IS_SUB = 0 and CREDIT_INFORMATION_ID = ${CREDIT_INFORMATION_ID};`;
        }
        console.log(query);

        if (query) {
            db.executeDML(query, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update Credit  Information."
                    });
                }
                else {
                    console.log(results);
                    db.commitConnection(connection);
                    res.send({
                        "code": 200,
                        "message": "Credit  Information saved successfully...",
                    });

                }

            });

        }
        else {
            db.commitConnection(connection);
            res.send({
                "code": 200,
                "message": "Credit  Information saved successfully...",
            });
        }
    } catch (error) {
        console.log(error);
    }
}





exports.update1 = (req, res) => {
    const errors = validationResult(req);
    console.log("credit1 ", req.body);
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
            mm.executeQueryData(`UPDATE ` + creditInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update creditInformation information."
                    });
                }
                else {
                    console.log(results);
                    mm.executeQuery(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 5`, supportKey, (error, resultsUpdate) => {
                        if (error) {
                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to update Credit  Information."
                            });
                        }
                        else {

                            res.send({
                                "code": 200,
                                "message": "Credit Information updated successfully...",
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
}