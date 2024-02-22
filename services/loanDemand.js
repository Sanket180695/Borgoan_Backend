const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var loanDemand = "loan_demand";
var viewLoanDemand = "view_" + loanDemand;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        LOAN_PURPOSE: req.body.LOAN_PURPOSE,
        LOAN_AMOUNT: req.body.LOAN_AMOUNT ? req.body.LOAN_AMOUNT : 0,
        LOAN_AMOUNT_IN_WORDS: req.body.LOAN_AMOUNT_IN_WORDS,
        LOAN_TYPE_ID: req.body.LOAN_TYPE_ID,
        BANK_LOAN_TYPE_ID: req.body.BANK_LOAN_TYPE_ID,
        TENURE_OF_LOAN: req.body.TENURE_OF_LOAN,
        INSTALLMENT_FREQUENCY_ID: req.body.INSTALLMENT_FREQUENCY_ID,

        CLIENT_ID: req.body.CLIENT_ID,
        WEEKER_SECTION_ID: req.body.WEEKER_SECTION_ID,
        PRIORITY_CODE_ID: req.body.PRIORITY_CODE_ID,
        INDUSTRY_CODE_ID: req.body.INDUSTRY_CODE_ID,
        REAL_ESTATE_MARKING: req.body.REAL_ESTATE_MARKING,

        INSTALLMENT_AMOUNT: req.body.INSTALLMENT_AMOUNT,
        RATE_OF_INTEREST: req.body.RATE_OF_INTEREST,
        SHARE_AMOUNT: req.body.SHARE_AMOUNT,
        INSURANCE_AMOUNT: req.body.INSURANCE_AMOUNT,
        SECURITY_DEPOSIT: req.body.SECURITY_DEPOSIT,
        SANCTION_AMOUNT: req.body.SANCTION_AMOUNT,
        PENALTY_INTEREST: req.body.PENALTY_INTEREST,
		NOMINEE_NAME: req.body.NOMINEE_NAME,
		NOMINEE_ADDRESS: req.body.NOMINEE_ADDRESS,
		NOMINEE_AGE: req.body.NOMINEE_AGE,
		NOMINEE_RELATION: req.body.NOMINEE_RELATION,
		SANCTION_DATE: req.body.SANCTION_DATE,
		INSTALLMENT_COUNT: req.body.INSTALLMENT_COUNT,
		//SANCTION_AMOUNT: req.body.SANCTION_AMOUNT,
		TERM_ID: req.body.TERM_ID,
		INTEREST_RATE: req.body.INTEREST_RATE,
		LOAN_PURPOSE_ID: req.body.LOAN_PURPOSE_ID,
		MOROTORIUM:req.body.MOROTORIUM,
        HAND_WRITTEN_AMT_IN_WORDS:req.body.HAND_WRITTEN_AMT_IN_WORDS
		
    }
    return data;
}




exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('LOAN_PURPOSE').optional(), body('LOAN_AMOUNT').isDecimal().optional(), body('LOAN_AMOUNT_IN_WORDS').optional(), body('LOAN_TYPE_ID').isInt().optional(), body('BANK_LOAN_TYPE_ID').isInt().optional(), body('TENURE_OF_LOAN').isInt().optional(), body('INSTALLMENT_FREQUENCY_ID').isInt().optional(), body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewLoanDemand + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get loanDemand count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewLoanDemand + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get loanDemand information."
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
            mm.executeQueryData('INSERT INTO ' + loanDemand + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save loanDemand information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "LoanDemand information saved successfully...",
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
    var connection = db.openConnection();
    var recordData = [];
    var IS_LOAN_SCHEME_UPDATE = req.body.IS_LOAN_SCHEME_UPDATE ? req.body.IS_LOAN_SCHEME_UPDATE : 0;
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
            db.executeDML(`UPDATE ` + loanDemand + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);

                    db.rollbackConnection(connection);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update loanDemand information."
                    });
                }
                else {
                    console.log(results);

                    db.executeDML(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 3`, '', supportKey, connection, (error, resultsUpdate) => {
                        if (error) {
                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            console.log(error);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update LoanDemand Information."
                            });
                        }
                        else {
                            if (data.LOAN_AMOUNT && data.LOAN_TYPE_ID) {
                                db.executeDML(`update praposal_master set LOAN_AMOUNT = ?,LOAN_TYPE_ID=? WHERE ID = ${data.PROPOSAL_ID} `, [data.LOAN_AMOUNT, data.LOAN_TYPE_ID], supportKey, connection, (error, resultsUpdate1) => {
                                    if (error) {
                                        //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to update LoanDemand Information."
                                        });
                                    }
                                    else {
                                        if (IS_LOAN_SCHEME_UPDATE) {
                                            updateExtraInfo(data.PROPOSAL_ID, req, res, connection, supportKey, data.CLIENT_ID)

                                        } else {
                                            db.commitConnection(connection)
                                            res.send({
                                                "code": 200,
                                                "message": "LoanDemand information updated successfully...",
                                            });
                                        }

                                    }
                                });
                            }
                            else {
                                if (IS_LOAN_SCHEME_UPDATE) {
                                    updateExtraInfo(data.PROPOSAL_ID, req, res, connection, supportKey, data.CLIENT_ID)

                                } else {
                                    db.commitConnection(connection)
                                    res.send({
                                        "code": 200,
                                        "message": "LoanDemand information updated successfully...",
                                    });
                                }
                            }
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


function updateExtraInfo(PROPOSAL_ID, req, res, connection, supportKey, CLIENT_ID) {

    db.executeDML(`SELECT * FROM loan_scheme_tab_mapping WHERE EXTRA_INFORMATION_ID = 10 and LOAN_SCHEME_ID = (SELECT LOAN_TYPE_ID FROM view_praposal_master where ID = ${PROPOSAL_ID})`, '', supportKey, connection, (error, resultscHECKHistory121) => {
        if (error) {
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
            db.rollbackConnection(connection);
            res.send({
                "code": 400,
                "message": "Failed to update praposal stage information."
            });
        }
        else {

            if (resultscHECKHistory121.length > 0) {

                db.executeDML(`select * from applicant_extra_information  where PROPOSAL_ID = ${PROPOSAL_ID}  AND TYPE = 'B' AND EXTRA_INFORMATION_ID = 10 `, '', supportKey, connection, (error, resultscHECKHistory12) => {
                    if (error) {
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update praposal stage information."
                        });
                    }
                    else {
                        if (resultscHECKHistory12.length > 0) {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "Loan demand information updated successfully."
                            });
                        }
                        else {
                            db.executeDML(`INSERT INTO applicant_extra_information(PROPOSAL_ID,EXTRA_INFORMATION_ID,IS_COMPLUSORY,CLIENT_ID,TYPE) VALUES (${PROPOSAL_ID},10,1,${CLIENT_ID},'B')`, '', supportKey, connection, (error, resultCheckProperty2) => {
                                if (error) {
                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    console.log(error);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update Loan demand information."
                                    });
                                }
                                else {

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Loan demand information updated successfully."
                                    });

                                }
                            })
                        }
                    }
                });

            }
            else {

                db.executeDML(`select * from applicant_extra_information  where PROPOSAL_ID = ${PROPOSAL_ID}  AND TYPE = 'B' AND EXTRA_INFORMATION_ID = 10 `, '', supportKey, connection, (error, resultscHECKHistory12) => {
                    if (error) {
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update praposal stage information."
                        });
                    }
                    else {
                        if (resultscHECKHistory12.length > 0) {

                            db.executeDML(`delete from applicant_extra_information where PROPOSAL_ID  = ${PROPOSAL_ID} and EXTRA_INFORMATION_ID = 10 and TYPE = 'B'`, '', supportKey, connection, (error, resultCheckProperty21) => {
                                if (error) {
                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    console.log(error);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update Loan demand information."
                                    });
                                }
                                else {

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Loan demand information updated successfully."
                                    });

                                }
                            })


                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "Loan demand information updated successfully."
                            });
                        }
                    }
                });
            }

        }
    });
}

function updateExtraInfo1(PROPOSAL_ID, req, res, connection, supportKey, CLIENT_ID) {

    db.executeDML(`select * from  applicant_extra_information  where PROPOSAL_ID = ${PROPOSAL_ID}  AND TYPE = 'B' AND EXTRA_INFORMATION_ID = 10`, '', supportKey, connection, (error, resultscHECKHistory12) => {
        if (error) {
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
            db.rollbackConnection(connection);
            res.send({
                "code": 400,
                "message": "Failed to update praposal stage information."
            });
        }
        else {
            if (resultscHECKHistory12.length > 0) {
                db.commitConnection(connection);
                res.send({
                    "code": 200,
                    "message": "Loan demand information updated successfully."
                });
            }
            else {
                db.executeDML(`INSERT INTO  applicant_extra_information(PROPOSAL_ID,EXTRA_INFORMATION_ID,IS_COMPLUSORY,CLIENT_ID,TYPE) VALUES (${PROPOSAL_ID},10,1,${CLIENT_ID},'B')`, '', supportKey, connection, (error, resultCheckProperty2) => {
                    if (error) {
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update Loan demand information."
                        });
                    }
                    else {

                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "Loan demand information updated successfully."
                        });

                    }
                })
            }
        }
    });
}


exports.update11111 = (req, res) => {
    console.log(req.body);
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
            mm.executeQueryData(`UPDATE ` + loanDemand + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update loanDemand information."
                    });
                }
                else {
                    console.log(results);

                    mm.executeQuery(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 3`, supportKey, (error, resultsUpdate) => {
                        if (error) {
                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to update LoanDemand Information."
                            });
                        }
                        else {

                            res.send({
                                "code": 200,
                                "message": "LoanDemand information updated successfully...",
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




exports.updateLoanScheme = (req, res) => {
    try {

        var BANK_LOAN_TYPE_ID = req.body.BANK_LOAN_TYPE_ID ? req.body.BANK_LOAN_TYPE_ID : '0';
        var WEEKER_SECTION_ID = req.body.WEEKER_SECTION_ID ? req.body.WEEKER_SECTION_ID : '0';
        var PRIORITY_CODE_ID = req.body.PRIORITY_CODE_ID ? req.body.PRIORITY_CODE_ID : '0';
        var INDUSTRY_CODE_ID = req.body.INDUSTRY_CODE_ID ? req.body.INDUSTRY_CODE_ID : '0';
        var REAL_ESTATE_MARKING = req.body.REAL_ESTATE_MARKING ? req.body.REAL_ESTATE_MARKING : '';
        var COMPLETE_STAGE_ID = req.body.COMPLETE_STAGE_ID;
        var PROPOSAL_ID = req.body.PROPOSAL_ID;

        var supportKey = req.headers['supportkey'];




        if (REAL_ESTATE_MARKING && BANK_LOAN_TYPE_ID) {
            var connection = db.openConnection();
            db.executeDML(`update loan_demand set BANK_LOAN_TYPE_ID= ?, REAL_ESTATE_MARKING = ?,INDUSTRY_CODE_ID = ?,PRIORITY_CODE_ID = ?,WEEKER_SECTION_ID = ? where PROPOSAL_ID = ? `, [BANK_LOAN_TYPE_ID, REAL_ESTATE_MARKING, INDUSTRY_CODE_ID, PRIORITY_CODE_ID, WEEKER_SECTION_ID, PROPOSAL_ID], supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);

                    db.rollbackConnection(connection);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update loanDemand information."
                    });
                }
                else {

                    var CURRENT_STAGE_ID = 13;

                    db.executeDML(`update praposal_master set CURRENT_STAGE_ID = ${CURRENT_STAGE_ID} where ID = ${PROPOSAL_ID}`, '', supportKey, connection, (error, resultupdateProposal) => {
                        if (error) {
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            console.log("h1 : ", error);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update praposal information."
                            });
                        }
                        else {

                            db.executeDML(`UPDATE praposal_stage_history SET IS_COMPLETED =1,COMPLETED_ON_DATETIME = '${mm.getSystemDate()}' where STAGE_ID = ${COMPLETE_STAGE_ID} AND PROPOSAL_ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, resultsUpdateHistory) => {
                                if (error) {
                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    console.log(error);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update praposal stage information."
                                    });
                                }
                                else {

                                    db.executeDML(`select * from  praposal_stage_history  where PROPOSAL_ID = ${PROPOSAL_ID}  AND STAGE_ID = ${CURRENT_STAGE_ID} and IS_COMPLETED =0`, '', supportKey, connection, (error, resultscHECKHistory) => {
                                        if (error) {
                                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                            console.log(error);
                                            db.rollbackConnection(connection);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update praposal stage information."
                                            });
                                        }
                                        else {
                                            if (resultscHECKHistory.length > 0) {
                                                db.executeDML(`UPDATE applicant_extra_information SET IS_PROVIDED = 0 WHERE PROPOSAL_ID = ${PROPOSAL_ID} AND  (SELECT IF(ID = ${BANK_LOAN_TYPE_ID} ,1,0) FROM loan_scheme_master WHERE IS_CASH_CREDIT = 1 AND ID = ${BANK_LOAN_TYPE_ID}) = 1 AND EXTRA_INFORMATION_ID = 6`, '', supportKey, connection, (ERROR, resultCheckProperty) => {
                                                    if (error) {
                                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                        console.log(error);
                                                        db.rollbackConnection(connection);
                                                        res.send({
                                                            "code": 400,
                                                            "message": "Failed to insert praposal stage information."
                                                        });
                                                    }
                                                    else {
                                                        updateExtraInfo(PROPOSAL_ID, req, res, connection, supportKey, resultscHECKHistory[0].CLIENT_ID)


                                                    }
                                                })
                                            }
                                            else {
                                                db.executeDML(`insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,IS_COMPLETED,CLIENT_ID) values (${PROPOSAL_ID},${CURRENT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${CURRENT_STAGE_ID}),0,1)`, '', supportKey, connection, (error, resultsInsertHistory) => {
                                                    if (error) {
                                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                        console.log(error);
                                                        db.rollbackConnection(connection);
                                                        res.send({
                                                            "code": 400,
                                                            "message": "Failed to insert praposal stage information."
                                                        });
                                                    }
                                                    else {

                                                        db.executeDML(`UPDATE applicant_extra_information SET IS_PROVIDED = 0 WHERE PROPOSAL_ID = ${PROPOSAL_ID} AND  (SELECT IF(ID = ${BANK_LOAN_TYPE_ID} ,1,0) FROM loan_scheme_master WHERE IS_CASH_CREDIT = 1 AND ID = ${BANK_LOAN_TYPE_ID}) = 1 AND EXTRA_INFORMATION_ID = 6`, '', supportKey, connection, (ERROR, resultCheckProperty) => {
                                                            if (error) {
                                                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                                console.log(error);
                                                                db.rollbackConnection(connection);
                                                                res.send({
                                                                    "code": 400,
                                                                    "message": "Failed to insert praposal stage information."
                                                                });
                                                            }
                                                            else {
                                                                updateExtraInfo(PROPOSAL_ID, req, res, connection, supportKey, 1)

                                                            }
                                                        })

                                                    }
                                                })

                                            }
                                        }
                                    });

                                }
                            })
                        }
                    })

                }
            });

        }
        else {
            res.send({
                "code": 400,
                "message": "PARAMETER MISSING- REAL ESTATE MARKING,INDUSTRY CODEID,PRIORITY CODEIOD WEEKER SECTION ID  "
            });
        }
    } catch (error) {
        console.log(error);
    }
}
