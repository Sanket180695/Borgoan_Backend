﻿const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var praposalMaster = "praposal_master";
var viewPraposalMaster = "view_" + praposalMaster;


function reqData(req) {

    var data = {
        APPLICANT_ID: req.body.APPLICANT_ID,
        LOAN_TYPE_ID: req.body.LOAN_TYPE_ID,
        LOAN_AMOUNT: req.body.LOAN_AMOUNT ? req.body.LOAN_AMOUNT : 0,
        CREATED_ON_DATETIME: req.body.CREATED_ON_DATETIME,
        LAST_UPDATED_ON_DATETIME: req.body.LAST_UPDATED_ON_DATETIME,
        CURRENT_STAGE_ID: req.body.CURRENT_STAGE_ID,
        CURRENT_STAGE_DATETIME: req.body.CURRENT_STAGE_DATETIME,
        BRANCH_ID: req.body.BRANCH_ID,

        CLIENT_ID: req.body.CLIENT_ID,
        BOT_REPLY_ID: req.body.BOT_REPLY_ID,
        CIBIL_SCORE: req.body.CIBIL_SCORE,
        CIBIL_REPORT_URL: req.body.CIBIL_REPORT_URL,
        PROCESSING_FEE_INFO: req.body.PROCESSING_FEE_INFO,
        PROCESSING_FEE: req.body.PROCESSING_FEE,
        VALIDITY: req.body.VALIDITY,
        APPLICANT_NAME: req.body.APPLICANT_NAME
    }
    return data;
}



exports.validate = function () {
    return [

        body('APPLICANT_ID').isInt(), 
        body('LOAN_TYPE_ID').isInt(), 
        body('LOAN_AMOUNT').isDecimal(), 
        body('CREATED_ON_DATETIME', ' parameter missing').exists(), 
        body('LAST_UPDATED_ON_DATETIME', ' parameter missing').exists(), 
        body('CURRENT_STAGE_ID').isInt(), 
        body('CURRENT_STAGE_DATETIME', ' parameter missing').exists(), 
        body('BRANCH_ID').isInt(), 
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
        mm.executeQuery('select count(*) as cnt from ' + viewPraposalMaster + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get praposals count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewPraposalMaster + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get praposal information."
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
            mm.executeQueryData('INSERT INTO ' + praposalMaster + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save praposal information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "Praposal information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + praposalMaster + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "Praposal information updated successfully...",
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




exports.updateStage1 = (req, res) => {
    try {

        var ID = req.body.ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var supportKey = req.headers['supportkey'];

        if (ID && CURRENT_STAGE_ID) {

            var connection = db.openConnection();

            db.executeDML(`update  ` + praposalMaster + ` set CURRENT_STAGE_ID = ${CURRENT_STAGE_ID} where ID = ${ID}`, '', supportKey, connection, (error, resultupdateProposal) => {
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

                    db.executeDML(`UPDATE praposal_stage_history SET IS_COMPLETED =1,COMPLETED_ON_DATETIME = '${mm.getSystemDate()}' where STAGE_ID = ${CURRENT_STAGE_ID - 1} AND PROPOSAL_ID = ${ID} `, '', supportKey, connection, (error, resultsUpdateHistory) => {
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

                            db.executeDML(`insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,IS_COMPLETED,CLIENT_ID) values (${ID},${CURRENT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${CURRENT_STAGE_ID}),0,1)`, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Praposal stage information updated successfully."
                                    });
                                }
                            })

                        }
                    })
                }
            })
        }
        else {

            res.send({
                "code": 400,
                "message": "parameter missing- ID,CURRENT_STAGE_ID"
            });

        }
    } catch (error) {
        console.log(error);
    }
}




exports.updatePraposalBranch1 = (req, res) => {
    try {

        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var BRANCH_ID = req.body.BRANCH_ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var NEXT_STAGE_ID = req.body.NEXT_STAGE_ID;
        var REMARKS = req.body.REMARKS;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var USER_ID = req.body.USER_ID;

        var supportKey = req.headers['supportkey'];
        if (CURRENT_STAGE_ID && PROPOSAL_ID) {
            var connection = db.openConnection();

            db.executeDML(`UPDATE ` + praposalMaster + ` SET BRANCH_ID = ${BRANCH_ID}, ` + (IS_COMPLETED ? `CURRENT_STAGE_ID = ${NEXT_STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}'` : `BRANCH_REMARK = '${REMARKS}'`) + `,LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    console.log(results);

                    console.log(IS_COMPLETED)
                    if (IS_COMPLETED == '1') {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',${IS_COMPLETED},${USER_ID},1)`

                        db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                db.commitConnection(connection);
                                res.send({
                                    "code": 200,
                                    "message": "Praposal information updated successfully."
                                });

                            }
                        });


                    }
                    else {
                        //query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',1,${USER_ID},1)`

                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "Praposal information updated successfully."
                        });

                    }
                }
            });
        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter missing branchId,CurrentStageId...",
            });

        }

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        console.log(error);
    }
}


exports.updateCibilInfo1 = (req, res) => {
    try {
        var CIBIL_SCORE = req.body.CIBIL_SCORE;
        var CIBIL_REPORT_URL = req.body.CIBIL_REPORT_URL;
        var supportKey = req.headers['supportkey'];
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var NEXT_STAGE_ID = req.body.NEXT_STAGE_ID;
        var REMARKS = req.body.REMARKS;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var USER_ID = req.body.USER_ID;

        if (CIBIL_SCORE && CIBIL_REPORT_URL && PROPOSAL_ID) {
            var connection = db.openConnection();
            db.executeDML(`UPDATE ` + praposalMaster + ` SET CIBIL_SCORE = ${CIBIL_SCORE},CIBIL_REPORT_URL='${CIBIL_REPORT_URL}',` + (IS_COMPLETED ? `CURRENT_STAGE_ID = ${NEXT_STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}'` : `CIBIL_REMARK = '${REMARKS}'`) + `, LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    console.log(results);
                    var query = ``;

                    if (IS_COMPLETED == 1) {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',${IS_COMPLETED},'${mm.getSystemDate()}',${USER_ID},1)`
                        db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                db.commitConnection(connection);
                                res.send({
                                    "code": 200,
                                    "message": "Praposal information updated successfully."
                                });

                            }
                        });

                    }
                    else {
                        //query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'',${IS_COMPLETED},${USER_ID},1)`
                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "Praposal information updated successfully."
                        });

                    }
                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing ...",
            });
        }
    } catch (error) {
        console.log(error);
    }
}



exports.updatePraposalBranch1 = (req, res) => {
    try {

        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var BRANCH_ID = req.body.BRANCH_ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var NEXT_STAGE_ID = req.body.NEXT_STAGE_ID;
        var REMARKS = req.body.REMARKS;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var USER_ID = req.body.USER_ID;

        var supportKey = req.headers['supportkey'];
        if (CURRENT_STAGE_ID && PROPOSAL_ID) {
            var connection = db.openConnection();

            db.executeDML(`UPDATE ` + praposalMaster + ` SET BRANCH_ID = ${BRANCH_ID},CURRENT_STAGE_ID = ${NEXT_STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}', LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    console.log(results);


                    db.executeDML(`UPDATE praposal_stage_history SET IS_COMPLETED = 1,USER_ID= ${USER_ID},COMPLETED_ON_DATETIME = '${mm.getSystemDate()}' where STAGE_ID = ${CURRENT_STAGE_ID} AND PROPOSAL_ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, resultsUpdateHistory) => {
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

                            var query = '';

                            console.log(IS_COMPLETED)
                            if (IS_COMPLETED == '1') {
                                query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',${IS_COMPLETED},'${mm.getSystemDate()}',${USER_ID},1)`
                            }
                            else {
                                query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',1,'${mm.getSystemDate()}',${USER_ID},1)`
                            }

                            db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Praposal stage information updated successfully."
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
                "message": "Parameter missing branchId,CurrentStageId...",
            });


        }

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        console.log(error);
    }
}






exports.updateCibilInfo1 = (req, res) => {
    try {
        var CIBIL_SCORE = req.body.CIBIL_SCORE;
        var CIBIL_REPORT_URL = req.body.CIBIL_REPORT_URL;
        var supportKey = req.headers['supportkey'];
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var NEXT_STAGE_ID = req.body.NEXT_STAGE_ID;
        var REMARKS = req.body.REMARKS;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var USER_ID = req.body.USER_ID;

        if (CIBIL_SCORE && CIBIL_REPORT_URL && PROPOSAL_ID) {
            var connection = db.openConnection();
            db.executeDML(`UPDATE ` + praposalMaster + ` SET CIBIL_SCORE = ${CIBIL_SCORE},CIBIL_REPORT_URL='${CIBIL_REPORT_URL}',CURRENT_STAGE_ID = ${NEXT_STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}', LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    console.log(results);
                    var query = ``;

                    if (IS_COMPLETED == 1) {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',${IS_COMPLETED},'${mm.getSystemDate()}',${USER_ID},1)`
                    }
                    else {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'',${IS_COMPLETED},${USER_ID},1)`
                    }


                    db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "Praposal stage information updated successfully."
                            });

                        }
                    });
                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing ...",
            });
        }
    } catch (error) {
        console.log(error);
    }
}


exports.changeStatus1 = (req, res) => {
    try {
        //console.log(req.body);
        var STAGE_ID = req.body.STAGE_ID;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var REMARKS = req.body.REMARKS ? req.body.REMARKS : '';
        var USER_ID = req.body.USER_ID ? req.body.USER_ID : 0;
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportkey'];

        console.log(PROPOSAL_ID, STAGE_ID);
        if (PROPOSAL_ID && STAGE_ID) {
            var connection = db.openConnection();

            db.executeDML(`UPDATE ` + praposalMaster + ` SET CURRENT_STAGE_ID = ${STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}', LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    var query = ``;
                    if (IS_COMPLETED == 1) {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${STAGE_ID}),'${REMARKS}',${IS_COMPLETED},'${mm.getSystemDate()}',${USER_ID},1)`
                    }
                    else {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${STAGE_ID}),'${REMARKS}',${IS_COMPLETED},${USER_ID},1)`
                    }
                    db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "Praposal stage information updated successfully."
                            });

                        }
                    });


                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing proposalId,stageId,isCompleted... ",
            });

        }

    } catch (error) {
        console.log(error);
    }
}




exports.updateStage = (req, res) => {
    try {

        var ID = req.body.ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var COMPLETE_STAGE_ID = req.body.COMPLETE_STAGE_ID;
        var supportKey = req.headers['supportkey'];

        if (ID && CURRENT_STAGE_ID) {

            var connection = db.openConnection();

            db.executeDML(`update  ` + praposalMaster + ` set CURRENT_STAGE_ID = ${CURRENT_STAGE_ID} where ID = ${ID}`, '', supportKey, connection, (error, resultupdateProposal) => {
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

                    db.executeDML(`UPDATE praposal_stage_history SET IS_COMPLETED =1,COMPLETED_ON_DATETIME = '${mm.getSystemDate()}' where STAGE_ID = ${COMPLETE_STAGE_ID} AND PROPOSAL_ID = ${ID} `, '', supportKey, connection, (error, resultsUpdateHistory) => {
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

                            db.executeDML(`insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,IS_COMPLETED,CLIENT_ID) values (${ID},${CURRENT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${CURRENT_STAGE_ID}),0,1)`, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Praposal stage information updated successfully."
                                    });
                                }
                            })

                        }
                    })
                }
            })
        }
        else {

            res.send({
                "code": 400,
                "message": "parameter missing- ID,CURRENT_STAGE_ID"
            });

        }
    } catch (error) {
        console.log(error);
    }
}



exports.updatePraposalBranch = (req, res) => {
    try {

        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var BRANCH_ID = req.body.BRANCH_ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var NEXT_STAGE_ID = req.body.NEXT_STAGE_ID;
        var REMARKS = req.body.REMARKS;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var USER_ID = req.body.USER_ID;

        var supportKey = req.headers['supportkey'];
        if (CURRENT_STAGE_ID && PROPOSAL_ID) {
            var connection = db.openConnection();

            db.executeDML(`UPDATE ` + praposalMaster + ` SET BRANCH_ID = ${BRANCH_ID}, ` + (IS_COMPLETED ? `CURRENT_STAGE_ID = ${NEXT_STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}'` : `BRANCH_REMARK = '${REMARKS}'`) + `,LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    console.log(results);

                    console.log(IS_COMPLETED)
                    if (IS_COMPLETED == '1') {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',${IS_COMPLETED},${USER_ID},1)`

                        db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                db.commitConnection(connection);
                                res.send({
                                    "code": 200,
                                    "message": "Praposal information updated successfully."
                                });

                            }
                        });


                    }
                    else {
                        //query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',1,${USER_ID},1)`

                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "Praposal information updated successfully."
                        });

                    }
                }
            });
        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter missing branchId,CurrentStageId...",
            });

        }

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        console.log(error);
    }
}


exports.updateCibilInfo = (req, res) => {
    try {
        var CIBIL_SCORE = req.body.CIBIL_SCORE;
        var CIBIL_REPORT_URL = req.body.CIBIL_REPORT_URL;
        var supportKey = req.headers['supportkey'];
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var NEXT_STAGE_ID = req.body.NEXT_STAGE_ID;
        var REMARKS = req.body.REMARKS;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var USER_ID = req.body.USER_ID;

        if (CIBIL_SCORE && CIBIL_REPORT_URL && PROPOSAL_ID) {
            var connection = db.openConnection();
            db.executeDML(`UPDATE ` + praposalMaster + ` SET CURRENT_STAGE_ID = ${NEXT_STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}',CIBIL_SCORE = ${CIBIL_SCORE},CIBIL_REPORT_URL='${CIBIL_REPORT_URL}',CIBIL_REMARK = '${REMARKS}', LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    console.log(results);
                    var query = ``;
                    db.executeDML(`UPDATE praposal_stage_history SET IS_COMPLETED =1,COMPLETED_ON_DATETIME = '${mm.getSystemDate()}' where STAGE_ID = ${CURRENT_STAGE_ID} AND PROPOSAL_ID = ${PROPOSAL_ID} and IS_COMPLETED = 0  `, '', supportKey, connection, (error, resultsUpdateHistory) => {
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
                            query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},'${REMARKS}',${IS_COMPLETED},'${mm.getSystemDate()}',${USER_ID},1)`
                            db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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
					var logAction = ``;
                                    var logDescription = ``;
                                        if(NEXT_STAGE_ID == 5){
                                            logAction =`Proposal kept on hold`;
                                            logDescription = `concat((select NAME from user_master where ID = ${USER_ID}),' has kept proposal ',(SELECT LOAN_KEY FROM PROPOSAL_MASTER WHERE ID=${PROPOSAL_ID}),' on hold with remark - ${REMARKS}')`;
                                        }
                                        else if(NEXT_STAGE_ID== 6){
                                            logAction =`Proposal Rejected`;
                                            logDescription = `CONCAT((select NAME from user_master where ID = ${USER_ID}),' has rejected the proposal ', (SELECT LOAN_KEY FROM PROPOSAL_MASTER WHERE ID=${PROPOSAL_ID}) ,'and given the remark - ${REMARKS}')`;
                                        }
                                        else{
                                            logAction =`User does successfull verification of CIBIL score`
                                            logDescription = `CONCAT((select NAME from user_master where ID = ${USER_ID}),' has completed cibil check for proposal ', (SELECT LOAN_KEY FROM PROPOSAL_MASTER WHERE ID=${PROPOSAL_ID}) ,' and given remark - ${REMARKS}')`;
                                        }
                         

                                    addLogs(PROPOSAL_ID,logAction,logDescription,USER_ID,CURRENT_STAGE_ID,NEXT_STAGE_ID,1,supportKey)
                                   
                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Praposal information updated successfully."
                                    });

                                }
                            });

                        }
                    })

                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing ...",
            });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.changeStatus = (req, res) => {
    try {
        //console.log(req.body);
        var STAGE_ID = req.body.STAGE_ID;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var REMARKS = req.body.REMARKS ? req.body.REMARKS : '';
        var USER_ID = req.body.USER_ID ? req.body.USER_ID : 0;
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportkey'];

        console.log(PROPOSAL_ID, STAGE_ID);
        if (PROPOSAL_ID && STAGE_ID) {
            var connection = db.openConnection();

            db.executeDML(`UPDATE ` + praposalMaster + ` SET CURRENT_STAGE_ID = ${STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}', LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {
                    var query = ``;
                    if (IS_COMPLETED == 1) {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${STAGE_ID},'${REMARKS}',${IS_COMPLETED},'${mm.getSystemDate()}',${USER_ID},1)`
                    }
                    else {
                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${STAGE_ID},'${REMARKS}',${IS_COMPLETED},${USER_ID},1)`
                    }
                    db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "Praposal stage information updated successfully."
                            });

                        }
                    });


                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing proposalId,stageId,isCompleted... ",
            });

        }

    } catch (error) {
        console.log(error);
    }
}




exports.updateStatus = (req, res) => {
    try {

        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var NEXT_STAGE_ID = req.body.NEXT_STAGE_ID;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var REMARKS = req.body.REMARKS ? req.body.REMARKS : '';
        var USER_ID = req.body.USER_ID ? req.body.USER_ID : 0;
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportkey'];

        if (PROPOSAL_ID && NEXT_STAGE_ID) {
            var connection = db.openConnection();

            db.executeDML(`UPDATE ` + praposalMaster + ` SET CURRENT_STAGE_ID = ${NEXT_STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}', LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {

                    db.executeDML(`UPDATE praposal_stage_history SET IS_COMPLETED =1,COMPLETED_ON_DATETIME = '${mm.getSystemDate()}' where STAGE_ID = ${CURRENT_STAGE_ID} AND PROPOSAL_ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, resultsUpdateHistory) => {
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

                            var query = ``;
                            // if (IS_COMPLETED == 1) {
                            //     query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${STAGE_ID},'${REMARKS}',${IS_COMPLETED},'${mm.getSystemDate()}',${USER_ID},1)`
                            // }
                            // else {
                            query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},'${REMARKS}',${IS_COMPLETED},${USER_ID},1)`
                            // }
                            db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Praposal stage information updated successfully."
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
                "message": "Parameter missing proposalId,stageId,isCompleted... ",
            });

        }

    } catch (error) {
        console.log(error);
    }
}



var async = require('async')






exports.updateProposalProcessingInfo = (req, res) => {
    try {

        var KYC = req.body.KYC;
        var INCOME = req.body.INCOME;
        var PURPOSE = req.body.PURPOSE;
        var proposalId = req.body.PROPOSAL_ID;
        var details = req.body.DETAILS;
        var amount = req.body.AMOUNT;
        var userId = req.body.USER_ID;
        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0;
        console.log(KYC, INCOME, JSON.stringify(PURPOSE));

        var supportKey = req.headers['supportkey'];

        if (KYC && INCOME && PURPOSE && amount && details) {
            var connection = db.openConnection();

            var data = [];
            for (let i = 0; i < PURPOSE[0].children.length; i++) {
                const purposeData = PURPOSE[0].children[i];

                for (let j = 0; j < purposeData.children.length; j++) {
                    const loantypeData = purposeData.children[j];

                    if (loantypeData.isLeaf && !loantypeData.disabled) {

                        data.push(loantypeData);
                    }
                    else {
                        for (let k = 0; k < loantypeData.children.length; k++) {
                            const documentData = loantypeData.children[k];

                            if (documentData.isLeaf && !documentData.disabled) {
                                data.push(documentData);
                            }

                        }
                    }
                }

            }




            for (let l = 0; l < KYC[0].children.length; l++) {
                const kycData = KYC[0].children[l];

                if (kycData.isLeaf && !kycData.disabled) {

                    data.push(kycData);
                }

            }


            for (let p = 0; p < INCOME[0].children.length; p++) {
                const incomeData = INCOME[0].children[p];

                for (let h = 0; h < incomeData.children.length; h++) {
                    const subIncomeData = incomeData.children[h];

                    for (let r = 0; r < subIncomeData.children.length; r++) {
                        const incomeDocumentData = subIncomeData.children[r];

                        if (incomeDocumentData.isLeaf && !incomeDocumentData.disabled) {

                            data.push(incomeDocumentData);

                        }

                    }

                }

            }

            console.log(data)
            async.eachSeries(data, function iteratorOverElems(documentMappingData, callback) {

                //var query = `select * from view_applicant_documents where PROPOSAL_ID = ${proposalId} and DOCUMENT_ID = ${documentMappingData.key} `;

                var query = `select * from view_applicant_documents where PROPOSAL_ID = ${proposalId}  and DOCUMENT_ID = ${documentMappingData.key} and TYPE = '${TYPE}' ` + (TYPE != 'B' ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``);

                mm.executeQuery(query, supportKey, (error, results) => {
                    if (error) {
                        console.log(error)
                        callback(error);
                    }
                    else {
                        if (results.length > 0) {

                            if (documentMappingData.checked) {

                                callback()

                            }
                            else {
                                //remove document
                                if (documentMappingData.disabled) {
                                    callback()
                                }
                                else {
                                    db.executeDML(`delete from applicant_documents where  ID = ${results[0].ID}`, '', supportKey, connection, (error, resultsDelete) => {
                                        if (error) {

                                            console.log(error);
                                            callback(error);

                                        }
                                        else {

                                            callback()

                                        }
                                    });
                                }

                            }
                        }
                        else {

                            if (documentMappingData.checked) {
                                //insert 

                                db.executeDML(`insert into applicant_documents(PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) values (?,?,(select NAME from  document_master where ID = ?),1,1,?,?)`, [proposalId, documentMappingData.key, documentMappingData.key, TYPE, APPLICANT_ID], supportKey, connection, (error, resultsInsert) => {
                                    if (error) {
                                        console.log(error);
                                        callback(error);
                                    }
                                    else {
                                        callback()
                                    }
                                });

                            }
                            else {
                                callback()
                            }
                        }
                    }
                })
            },
                function subCb(error) {
                    if (error) {
                        //rollback
                        //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to map document details ..."
                        });
                    } else {


                        generateCode(supportKey, (error, CHALLAN_NO) => {
                            if (error) {

                                console.log(error);
                                //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                                //db.rollbackConnectionbotMapping/markCompletedEntry (connection);
                                // console.log(responseData)
                                db.rollbackConnection(connection);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to update payment information...",
                                    //"data": responseData
                                });

                            }
                            else {

                                db.executeDML(`insert into payment_transaction(PROPOSAL_ID,AMOUNT,STATUS,CLIENT_ID,DETAILS,CHALAN_NUMBER,BRANCH_ID) values (?,?,?,1,?,?,(SELECT BRANCH_ID FROM praposal_master WHERE ID = ${proposalId}))`, [proposalId, amount, 'P', details, CHALLAN_NO], supportKey, connection, (error, resultsInsert) => {
                                    if (error) {
                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to update payment information...",
                                            //"data": responseData
                                        });

                                    }
                                    else {

                                        db.executeDML(`update praposal_master set LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}',CURRENT_STAGE_ID = 10 ,CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}' where ID =${proposalId}`, '', supportKey, connection, (error, resultsproposal) => {
                                            if (error) {

                                                //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                console.log(error);
                                                db.rollbackConnection(connection);
                                                res.send({
                                                    "code": 400,
                                                    "message": "Failed to insert praposal stage information."
                                                });
                                            }
                                            else {
                                                db.executeDML(`update praposal_stage_history set IS_COMPLETED='1',COMPLETED_ON_DATETIME = '${mm.getSystemDate()}',USER_ID = ${userId} where PROPOSAL_ID =${proposalId} and STAGE_ID = ${CURRENT_STAGE_ID}`, '', supportKey, connection, (error, resultsUpdateStage) => {
                                                    if (error) {

                                                        //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                        console.log(error);
                                                        db.rollbackConnection(connection);
                                                        res.send({
                                                            "code": 400,
                                                            "message": "Failed to insert praposal stage information."
                                                        });
                                                    }
                                                    else {
                                                        query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,IS_COMPLETED,CLIENT_ID) values (${proposalId},10,0,1)`
                                                        db.executeDML(query, '', supportKey, connection, (error, resultsInsertStageHistory) => {
                                                            if (error) {
                                                                console.log(error);
                                                                db.rollbackConnection(connection);
                                                                res.send({
                                                                    "code": 400,
                                                                    "message": "Failed to insert praposal stage information."
                                                                });
                                                            }
                                                            else {
     var logAction = `Proposal Information accepted and mapped processing fee for the proposal `
                                                                var logDescription = `CONCAT((select NAME from user_master where ID = ${userId}),' has checked & verified all the information in proposal ', (SELECT LOAN_KEY FROM PROPOSAL_MASTER WHERE ID=${proposalId}) ,' and sent the proposal in NEXT_STAGE ')`;



                                                                addLogs(proposalId, logAction, logDescription, userId, CURRENT_STAGE_ID, 10, 1,supportKey)

                                                                db.commitConnection(connection);
                                                                res.send({
                                                                    "code": 200,
                                                                    "message": "Payment Information saved successfully...",
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

                        })

                    }
                });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing- KYC,INCOME,PURPOSE",
            });

        }
    } catch (error) {
        console.log(error);
    }
}

function generateCode(supportKey, callback) {


    var code = mm.generateKeyNumber(9);

    mm.executeQuery(`select * from payment_transaction where CHALAN_NUMBER like '${code}' `, supportKey, (error, results) => {
        if (error) {
            console.log(error);
            generateCode(supportKey, callback)
        }
        else {
            if (results.length > 0) {
                generateCode(supportKey, callback)
            }
            else {
                callback(null, code)
            }
        }
    });
    return;
}



exports.updateProposalInfo = (req, res) => {
    try {

        var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
        var NEXT_STAGE_ID = req.body.NEXT_STAGE_ID;
        var IS_COMPLETED = req.body.IS_COMPLETED;
        var REMARKS = req.body.REMARKS ? req.body.REMARKS : '';
        var USER_ID = req.body.USER_ID ? req.body.USER_ID : 0;
        var PROPOSAL_FILE = req.body.PROPOSAL_FILE;
        var PROPOSAL_REPORT = req.body.PROPOSAL_REPORT;
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportkey'];

        if (PROPOSAL_ID && NEXT_STAGE_ID && PROPOSAL_FILE && PROPOSAL_REPORT) {
            var connection = db.openConnection();

            db.executeDML(`UPDATE ` + praposalMaster + ` SET CURRENT_STAGE_ID = ${NEXT_STAGE_ID},CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}', LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}',PROPOSAL_FILE='${PROPOSAL_FILE}' ,PROPOSAL_REPORT = '${PROPOSAL_REPORT}' where ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update praposal information."
                    });
                }
                else {

                    db.executeDML(`UPDATE praposal_stage_history SET IS_COMPLETED =1,COMPLETED_ON_DATETIME = '${mm.getSystemDate()}' where STAGE_ID = ${CURRENT_STAGE_ID} AND PROPOSAL_ID = ${PROPOSAL_ID} `, '', supportKey, connection, (error, resultsUpdateHistory) => {
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

                            var query = ``;
                            // if (IS_COMPLETED == 1) {
                            //     query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,COMPLETED_ON_DATETIME,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${STAGE_ID}),'${REMARKS}',${IS_COMPLETED},'${mm.getSystemDate()}',${USER_ID},1)`
                            // }
                            // else {
                            query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,NAME,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PROPOSAL_ID},${NEXT_STAGE_ID},(SELECT NAME FROM proposal_stage_master WHERE ID = ${NEXT_STAGE_ID}),'${REMARKS}',${IS_COMPLETED},${USER_ID},1)`
                            // }
                            db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Praposal stage information updated successfully."
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
                "message": "Parameter missing proposalId,stageId,isCompleted... ",
            });

        }

    } catch (error) {
        console.log(error);
    }
}




exports.createProposal = (req, res) => {
    try {

        /* TODO HERE :
        
        INSERT RECORD IN PROPOSAL MASTER 
        INSERT RECORD data IN  SINGLE TABLE
        INSERT DOCUMENTS IN APPLICAN_DOCUMENTS
        INSERT GENERATED KEY FOR PROPOSAL 
        INSERT PROPOSAL STAGE HISTORY 
        INSERT PROPOSAL LOGS
        
      
        var data = {
            ASSING_BRANCH_ID: req.body.ASSING_BRANCH_ID,
            FIRM_ADDRESS_ID: req.body.FIRM_ADDRESS_ID,
            IS_CUSTOMER_OF_BANK: req.body.IS_CUSTOMER_OF_BANK,
            BRANCH_ID: req.body.BRANCH_ID,
            PRAPOSAL_TYPE: req.body.PRAPOSAL_TYPE,
            APPLICANT_NAME: req.body.APPLICANT_NAME,
            DOB: req.body.DOB,
            GENDER: req.body.GENDER,
            CAST: req.body.CAST,
            PAN: req.body.PAN,
            AADHAR: req.body.AADHAR,
            RELIGION: req.body.RELIGION,
            EDUCATION: req.body.EDUCATION,
            CURRENT_ADDRESS_ID: req.body.CURRENT_ADDRESS_ID,
            MOBILE_NO1: req.body.MOBILE_NO1,
            EMAIL_ID: req.body.EMAIL_ID,
            MEMBERS_IN_FAMILY: req.body.MEMBERS_IN_FAMILY,
            LOAN_PURPOSE: req.body.LOAN_PURPOSE,
            LOAN_AMOUNT: req.body.LOAN_AMOUNT,
            LOAN_AMOUNT_IN_WORDS: req.body.LOAN_AMOUNT_IN_WORDS,
            LOAN_TYPE_ID: req.body.LOAN_TYPE_ID,
            IS_EXISTING_LOAN_WITH_OTHER_BANKS: req.body.IS_EXISTING_LOAN_WITH_OTHER_BANKS,
            IS_LOAN_FOR_FILL_PREVIOUS_LOAN: req.body.IS_LOAN_FOR_FILL_PREVIOUS_LOAN,
            OUTSTANDING_BANK_AMOUNT: req.body.OUTSTANDING_BANK_AMOUNT,
            ALL_LOAN_MONTHLY_INSTALLMENT: req.body.ALL_LOAN_MONTHLY_INSTALLMENT,
            F_NAME_OF_FIRM: req.body.F_NAME_OF_FIRM,
            F_NATURE_OF_BUSINESS: req.body.F_NATURE_OF_BUSINESS,
            F_CONSTITUTION_OF_FIRM: req.body.F_CONSTITUTION_OF_FIRM,
            F_IS_MSME_REGISTERED: req.body.F_IS_MSME_REGISTERED,
            F_MSME_REGISTRATION_NUMBER: req.body.F_MSME_REGISTRATION_NUMBER,
            F_MSME_REGISTRATION_DATE: req.body.F_MSME_REGISTRATION_DATE,
            F_TYPE_OF_FIRM_REGISTRATION: req.body.F_TYPE_OF_FIRM_REGISTRATION,
            F_DATE_OF_REGISTRATION: req.body.F_DATE_OF_REGISTRATION,
            F_REGISTRATION_NUMBER: req.body.F_REGISTRATION_NUMBER,
            F_PAN_NUMBER_OF_FIRM: req.body.F_PAN_NUMBER_OF_FIRM,
            F_OWNERSHIP_OF_BUSINESS: req.body.F_OWNERSHIP_OF_BUSINESS,
            F_IS_SHOP_ACT_LICENSE: req.body.F_IS_SHOP_ACT_LICENSE,
            F_IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR: req.body.F_IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR,
            F_IS_GST_REGISTARTION_CERTIFICATE: req.body.F_IS_GST_REGISTARTION_CERTIFICATE,
            F_IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY: req.body.F_IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY,
            F_IS_OTHER_LICENSE: req.body.F_IS_OTHER_LICENSE,
            F_OTHER_LICENSE_NAME: req.body.F_OTHER_LICENSE_NAME,
            F_LANDLINE_NUMBER: req.body.F_LANDLINE_NUMBER,
            F_SHOP_ACT_NUMBER: req.body.F_SHOP_ACT_NUMBER,
            F_GST_NUMBER: req.body.F_GST_NUMBER,
            F_OTHER_LICENSE_NUMBER: req.body.F_OTHER_LICENSE_NUMBER,
            FIRM_INVESTMENT: req.body.FIRM_INVESTMENT,
            FIRM_YEARLY_BUSINESS: req.body.FIRM_YEARLY_BUSINESS,
            FIRM_YEARLY_PROFIT: req.body.FIRM_YEARLY_PROFIT,
            OWNER_NAME: req.body.OWNER_NAME,
            MOVABLE_TYPE: req.body.MOVABLE_TYPE,
            IS_MACHINERY_OR_OTHER: req.body.IS_MACHINERY_OR_OTHER,
            IS_AGRICULTURE_LAND_OR_OTHER: req.body.IS_AGRICULTURE_LAND_OR_OTHER,
            VALUATION_AMOUNT: req.body.VALUATION_AMOUNT,
            IS_INCOME_TAX_FILED: req.body.IS_INCOME_TAX_FILED,
            FINANCIAL_YEAR: req.body.FINANCIAL_YEAR,
            INCOME_AMOUNT: req.body.INCOME_AMOUNT,
            TAX_PAID_AMOUNT: req.body.TAX_PAID_AMOUNT,
            INCOME_SOURCE: req.body.INCOME_SOURCE,
            PLACE_OF_EMPLOYMENT: req.body.PLACE_OF_EMPLOYMENT,
            ORGANISATION_NAME: req.body.ORGANISATION_NAME,
            POST_OF_EMPLOYMENT: req.body.POST_OF_EMPLOYMENT,
            TYPE_OF_EMPLOYMENT: req.body.TYPE_OF_EMPLOYMENT,
            GROSS_SALARY: req.body.GROSS_SALARY,
            NET_SALARY: req.body.NET_SALARY,
            SALARY_PAID_TYPE: req.body.SALARY_PAID_TYPE,
            BANK_NAME: req.body.BANK_NAME,
            BRANCH_NAME: req.body.BRANCH_NAME,
            IFSC_CODE: req.body.IFSC_CODE,
            IS_NAME_APPEAR_IN_7_12: req.body.IS_NAME_APPEAR_IN_7_12,
            TOTAL_AREA_IN_APPLICANT_NAME: req.body.TOTAL_AREA_IN_APPLICANT_NAME,
            DETAILED_ADDRESS_ID: req.body.DETAILED_ADDRESS_ID,
            TYPE_OF_AGRICULTURE_LAND: req.body.TYPE_OF_AGRICULTURE_LAND,
            CURRENT_AGRICULTURE_PRODUCT: req.body.CURRENT_AGRICULTURE_PRODUCT,
            ANNUAL_INCOME_FROM_THIS_LAND: req.body.ANNUAL_INCOME_FROM_THIS_LAND,
            NAME_OF_FIRM: req.body.NAME_OF_FIRM,
            NATURE_OF_FIRM: req.body.NATURE_OF_FIRM,
            ADDRESS_ID: req.body.ADDRESS_ID,
            NUMBER_OF_YEARS: req.body.NUMBER_OF_YEARS,
            OWNERSHIP_TYPE: req.body.OWNERSHIP_TYPE,
            IS_SHOP_ACT_LICENSE: req.body.IS_SHOP_ACT_LICENSE,
            IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR: req.body.IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR,
            IS_GST_REGISTARTION_CERTIFICATE: req.body.IS_GST_REGISTARTION_CERTIFICATE,
            IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY: req.body.IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY,
            IS_OTHER_LICENSE: req.body.IS_OTHER_LICENSE,
            OTHER_LICENSE_NUMBER: req.body.OTHER_LICENSE_NUMBER,
            SHOP_ACT_NUMBER: req.body.SHOP_ACT_NUMBER,
            GST_NUMBER: req.body.GST_NUMBER,
            IS_MSME_REGISTERED: req.body.IS_MSME_REGISTERED,
            MSME_REGISTRATION_NUMBER: req.body.MSME_REGISTRATION_NUMBER,
            MSME_REGISTRATION_DATE: req.body.MSME_REGISTRATION_DATE,
            CLIENT_ID: req.body.CLIENT_ID,

        };
*/
var data = {
            ASSING_BRANCH_ID: req.body.ASSING_BRANCH_ID,
            FIRM_ADDRESS_ID: req.body.FIRM_ADDRESS_ID,
            IS_CUSTOMER_OF_BANK: req.body.IS_CUSTOMER_OF_BANK,
            BRANCH_ID: req.body.BRANCH_ID,
            PRAPOSAL_TYPE: req.body.PRAPOSAL_TYPE,
            APPLICANT_NAME: req.body.APPLICANT_NAME,
            DOB: req.body.DOB,
            GENDER: req.body.GENDER,
            CAST: req.body.CAST,
            PAN: req.body.PAN,
            AADHAR: req.body.AADHAR,
            RELIGION: req.body.RELIGION,
            EDUCATION: req.body.EDUCATION,
            CURRENT_ADDRESS_ID: req.body.CURRENT_ADDRESS_ID,
            MOBILE_NO1: req.body.MOBILE_NO1,
            EMAIL_ID: req.body.EMAIL_ID,
            MEMBERS_IN_FAMILY: req.body.MEMBERS_IN_FAMILY,
            LOAN_PURPOSE: req.body.LOAN_PURPOSE,
            LOAN_AMOUNT: req.body.LOAN_AMOUNT,
            LOAN_AMOUNT_IN_WORDS: req.body.LOAN_AMOUNT_IN_WORDS,
            LOAN_TYPE_ID: req.body.LOAN_TYPE_ID,
            IS_EXISTING_LOAN_WITH_OTHER_BANKS: req.body.IS_EXISTING_LOAN_WITH_OTHER_BANKS,
            IS_LOAN_FOR_FILL_PREVIOUS_LOAN: req.body.IS_LOAN_FOR_FILL_PREVIOUS_LOAN,
            OUTSTANDING_BANK_AMOUNT: req.body.OUTSTANDING_BANK_AMOUNT,
            ALL_LOAN_MONTHLY_INSTALLMENT: req.body.ALL_LOAN_MONTHLY_INSTALLMENT,
            F_NAME_OF_FIRM: req.body.F_NAME_OF_FIRM,
            F_NATURE_OF_BUSINESS: req.body.F_NATURE_OF_BUSINESS,
            F_CONSTITUTION_OF_FIRM: req.body.F_CONSTITUTION_OF_FIRM,
            F_IS_MSME_REGISTERED: req.body.F_IS_MSME_REGISTERED,
            F_MSME_REGISTRATION_NUMBER: req.body.F_MSME_REGISTRATION_NUMBER,
            F_MSME_REGISTRATION_DATE: req.body.F_MSME_REGISTRATION_DATE,
            F_PAN_NUMBER_OF_FIRM: req.body.F_PAN_NUMBER_OF_FIRM,
            F_IS_GST_REGISTARTION_CERTIFICATE: req.body.F_IS_GST_REGISTARTION_CERTIFICATE,
            F_LANDLINE_NUMBER: req.body.F_LANDLINE_NUMBER,
            F_GST_NUMBER: req.body.F_GST_NUMBER,
            FIRM_INVESTMENT: req.body.FIRM_INVESTMENT,
            FIRM_YEARLY_BUSINESS: req.body.FIRM_YEARLY_BUSINESS,
            FIRM_YEARLY_PROFIT: req.body.FIRM_YEARLY_PROFIT,
            IS_AGRICULTURE_LAND_OR_OTHER: req.body.IS_AGRICULTURE_LAND_OR_OTHER,
            VALUATION_AMOUNT: req.body.VALUATION_AMOUNT,
            IS_INCOME_TAX_FILED: req.body.IS_INCOME_TAX_FILED,
            FINANCIAL_YEAR: req.body.FINANCIAL_YEAR,
            INCOME_AMOUNT: req.body.INCOME_AMOUNT,
            TAX_PAID_AMOUNT: req.body.TAX_PAID_AMOUNT,
            INCOME_SOURCE: req.body.INCOME_SOURCE,
            PLACE_OF_EMPLOYMENT: req.body.PLACE_OF_EMPLOYMENT,
            ORGANISATION_NAME: req.body.ORGANISATION_NAME,
            POST_OF_EMPLOYMENT: req.body.POST_OF_EMPLOYMENT,
            TYPE_OF_EMPLOYMENT: req.body.TYPE_OF_EMPLOYMENT,
            GROSS_SALARY: req.body.GROSS_SALARY,
            NET_SALARY: req.body.NET_SALARY,
            SALARY_PAID_TYPE: req.body.SALARY_PAID_TYPE,
            BANK_NAME: req.body.BANK_NAME,
            TOTAL_AREA_IN_APPLICANT_NAME: req.body.TOTAL_AREA_IN_APPLICANT_NAME,
            DETAILED_ADDRESS_ID: req.body.DETAILED_ADDRESS_ID,
            TYPE_OF_AGRICULTURE_LAND: req.body.TYPE_OF_AGRICULTURE_LAND,
            CURRENT_AGRICULTURE_PRODUCT: req.body.CURRENT_AGRICULTURE_PRODUCT,
            ANNUAL_INCOME_FROM_THIS_LAND: req.body.ANNUAL_INCOME_FROM_THIS_LAND,
            NAME_OF_FIRM: req.body.NAME_OF_FIRM,
            NATURE_OF_FIRM: req.body.NATURE_OF_FIRM,
            ADDRESS_ID: req.body.ADDRESS_ID,
            NUMBER_OF_YEARS: req.body.NUMBER_OF_YEARS,
            CLIENT_ID: req.body.CLIENT_ID,
            TYPE_OF_SECTOR: req.body.TYPE_OF_SECTOR ,
            B_FIRM_INVESTMENT: req.body.B_FIRM_INVESTMENT,
            B_FIRM_YEARLY_BUSINESS: req.body.B_FIRM_YEARLY_BUSINESS,
            B_FIRM_YEARLY_PROFIT: req.body.B_FIRM_YEARLY_PROFIT,
            TYPE_OF_AGRICULTURAL_LAND: req.body.TYPE_OF_AGRICULTURAL_LAND,
            VILLAGE_NAME: req.body.VILLAGE_NAME,
            IS_ANOTHER_AGRI_SUPPLEMENT_TO_BUSINESS: req.body.IS_ANOTHER_AGRI_SUPPLEMENT_TO_BUSINESS,
            IS_AGRICULTURE_LAND_OR_OTHER_PROPERTY: req.body.IS_AGRICULTURE_LAND_OR_OTHER_PROPERTY,
	    USER_ID: req.body.USER_ID
            
        };

        var supportKey = req.headers['supportkey']

        var connection = db.openConnection();
        var CURRENT_ADDRESS = req.body.CURRENT_ADDRESS;
        var EMPLOYMENT_ADDRESS = req.body.EMPLOYMENT_ADDRESS;
        var BUSINESS_PROFESSION_ADDRESS = req.body.BUSINESS_PROFESSION_ADDRESS;
        var FIRM_ADDRESS = req.body.FIRM_ADDRESS;
        var AGRI_ADDRESS = req.body.AGRI_ADDRESS;


        var addressRecords = [];

        if (CURRENT_ADDRESS) {
            CURRENT_ADDRESS.TYPE = "C";
            addressRecords.push(CURRENT_ADDRESS);

        }
        else {
            data.CURRENT_ADDRESS_ID = 0;
        }

        if (EMPLOYMENT_ADDRESS) {
            EMPLOYMENT_ADDRESS.TYPE = "E";
            addressRecords.push(EMPLOYMENT_ADDRESS);

        }
        else {
            data.PLACE_OF_EMPLOYMENT = 0;
        }

        if (BUSINESS_PROFESSION_ADDRESS) {
            BUSINESS_PROFESSION_ADDRESS.TYPE = "B";
            addressRecords.push(BUSINESS_PROFESSION_ADDRESS);

        }
        else {
            data.ADDRESS_ID = 0;
        }

        if (FIRM_ADDRESS) {
            FIRM_ADDRESS.TYPE = "F";
            addressRecords.push(FIRM_ADDRESS);

        }
        else {
            data.FIRM_ADDRESS_ID = 0;
        }


        if (AGRI_ADDRESS) {
            AGRI_ADDRESS.TYPE = "A";
            addressRecords.push(AGRI_ADDRESS);

        }
        else {
            data.DETAILED_ADDRESS_ID = 0;
        }



        async.eachSeries(addressRecords, function iteratorOverElems(addressItem, callback) {
            if (addressItem && addressItem.TYPE) {
                db.executeDML(`insert into address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values (?,?,?,?,?,?,?,?,?)`, [addressItem.STATE, addressItem.DISTRICT, addressItem.TALUKA, addressItem.VILLAGE, addressItem.PINCODE, addressItem.LANDMARK, addressItem.BUILDING, addressItem.HOUSE_NO, addressItem.CLIENT_ID], supportKey, connection, (error, resultsAddressInsert) => {
                    if (error) {
                        console.log(error);
                        callback(error);
                    }
                    else {

                        if (addressItem.TYPE == 'C') {
                            data.CURRENT_ADDRESS_ID = resultsAddressInsert.insertId;
                            callback();
                        }
                        else if (addressItem.TYPE == 'E') {
                            data.PLACE_OF_EMPLOYMENT = resultsAddressInsert.insertId;
                            callback();
                        }
                        else if (addressItem.TYPE == 'B') {
                            data.ADDRESS_ID = resultsAddressInsert.insertId;
                            callback();
                        }
                        else if (addressItem.TYPE == 'F') {
                            data.FIRM_ADDRESS_ID = resultsAddressInsert.insertId;
                            callback();
                        }
                        else if (addressItem.TYPE == 'A') {
                            data.DETAILED_ADDRESS_ID = resultsAddressInsert.insertId;
                            callback();
                        }
                        else {
                            callback();
                        }

                    }
                });
            }
            else { callback(); }

        }, function subCb(error) {
            if (error) {
                mm.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to create proposal "
                });
            } else {

                db.executeDQL(`SELECT * FROM applicant_master WHERE MOBILE_NUMBER = ? `, [data.MOBILE_NO1], supportKey, (error, resultsCheckApplicant) => {
                    if (error) {
                        console.log(error);
                        db.rollbackConnection(connection)
                        req.send({
                            code: 400,
                            "message": "Failed to create proposal"
                        })
                    }
                    else {

                        if (resultsCheckApplicant.length > 0) {
                            generateCode(supportKey, (error, LOAN_KEY) => {
                                if (error) {
                                    console.log(error);
                                    db.rollbackConnection(connection)
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update proposal information...",

                                    });
                                }
                                else {
                                    db.executeDML(`insert into praposal_master(APPLICANT_ID,LOAN_TYPE_ID,LOAN_AMOUNT,LOAN_KEY,CLIENT_ID,PAN,AADHAR,PRAPOSAL_TYPE,BRANCH_ID) values (?,?,?,?,?,?,?,?,?)`, [resultsCheckApplicant[0].ID, data.LOAN_TYPE_ID, data.LOAN_AMOUNT, LOAN_KEY, data.CLIENT_ID, data.PAN, data.AADHAR, data.PRAPOSAL_TYPE,data.ASSING_BRANCH_ID], supportKey, connection, (error, resultsProposal) => {
                                        if (error) {
                                            console.log(error);
                                            db.rollbackConnection(connection)
                                            res.send({
                                                code: 400,
                                                "message": "Failed to create proposal information"
                                            })
                                        }
                                        else {
                                            var userKey = resultsCheckApplicant[0].ID;
                                            data.PROPOSAL_ID = resultsProposal.insertId;
                                            db.executeDML(`insert into basic_form_details SET ?`, data, supportKey, connection, (error, resultsBasicForms) => {
                                                if (error) {
                                                    console.log(error);
                                                    db.rollbackConnection(connection)
                                                    res.send({
                                                        code: 400,
                                                        "message": "Failed to create proposal information"
                                                    })
                                                }
                                                else {
                                                    var documentQuery = ``;

                                                    if (data.PRAPOSAL_TYPE.trim() == 'वैयक्तिक') {


                                                        if (data.INCOME_SOURCE == 1) {

                                                            documentQuery = `INSERT INTO applicant_documents (PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES
                                                        (${resultsProposal.insertId},1,'पॅनकार्ड','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},2,'आधारकार्ड','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},3,'अर्जदाराचा फोटो','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},4,'पगार स्लिप','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},5,'बँक पासबुक (latest 6 month entries)','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},6,'इनकम टैक्स रिटर्न (लेटेस्ट)','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},7,'फॉर्म 16','',0,1,'B',${userKey})`;
                                                        }
                                                        else if (data.INCOME_SOURCE == 2 || data.INCOME_SOURCE == 4) {

                                                            documentQuery = `INSERT INTO applicant_documents (PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES
                                                        (${resultsProposal.insertId},1,'पॅनकार्ड','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},2,'आधारकार्ड','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},3,'अर्जदाराचा फोटो','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},8,'GST नोंदणी प्रमाणपत्र','',0,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},9,'दूकाने अभिनियम परवाना','',0,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},6,'इनकम टैक्स रिटर्न (लेटेस्ट)','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},10,'मागील वर्षाची बॅलेंन्स शीट','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},11,'मागील वर्षाचे प्रॉफिट- लॉस / रिसिप्ट पेमेंट अकाउंट स्टेटमेंट','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},12,'मागील वर्षाचे कॅपिटल अकाउंट स्टेटमेंट','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},13,'स्टॉक स्टेटमेंट (लेटेस्ट)','',0,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},14,'व्यवसाय ठिकाणाचा फोटो','',1,1,'B',${userKey})`;
                                                        }
                                                        else if (data.INCOME_SOURCE == 3) {

                                                            documentQuery = `INSERT INTO applicant_documents (PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES
                                                        (${resultsProposal.insertId},1,'पॅनकार्ड','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},2,'आधारकार्ड','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},3,'अर्जदाराचा फोटो','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},15,'8-अ  उतारा','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},16,'7/12 उतारा','',1,1,'B',${userKey}),
                                                        (${resultsProposal.insertId},17,'उत्पन्नाचा दाखला','',1,1,'B',${userKey})`;
                                                        }
                                                    }
                                                    else {
                                                        documentQuery = `INSERT INTO applicant_documents (PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES
                                                    (${resultsProposal.insertId},1,'पॕनकार्ड','',1,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},8,'GST नोंदणी प्रमाणपत्र','',0,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},19,'संस्था नोंदणी प्रमाणपत्र','',0,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},6,'इनकम टैक्स रिटर्न (लेटेस्ट)','',1,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},18,'इनकम टैक्स कॉम्प्यूटेशन','',1,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},10,'मागील वर्षाची बॅलेंन्स शीट','',1,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},11,'मागील वर्षाचे प्रॉफिट- लॉस / रिसिप्ट पेमेंट अकाउंट स्टेटमेंट','',1,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},12,'मागील वर्षाचे कॅपिटल अकाउंट स्टेटमेंट','',0,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},13,'स्टॉक स्टेटमेंट (लेटेस्ट)','',0,1,'B',${userKey}),
                                                    (${resultsProposal.insertId},14,'व्यवसाय ठिकाणाचा फोटो','',1,1,'B',${userKey})`;

                                                    }

                                                    db.executeDML(documentQuery, '', supportKey, connection, (error, resultsInsertDocument) => {
                                                        if (error) {
                                                            console.log(error);
                                                            db.rollbackConnection(connection)
                                                            res.send({
                                                                code: 400,
                                                                "message": "Failed to create proposal information"
                                                            })
                                                        }
                                                        else {
                                                            db.executeDML(`call spAddPraposalInformation(?)`, [resultsProposal.insertId], supportKey, connection, (error, resultsSp) => {
                                                                if (error) {
                                                                    console.log(error);
                                                                    db.rollbackConnection(connection);
                                                                    res.send({
                                                                        "code": 400,
                                                                        "message": "Failed to update proposal information...",
                                                                        //"data": responseData
                                                                    });
                                                                }
                                                                else {
                                                                    console.log("SP RESULT",resultsSp);
                                                                    db.executeDML(`insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,IS_COMPLETED,COMPLETED_ON_DATETIME,CLIENT_ID) values (?,1,2,?,?),(?,2,0,?,?)`, [resultsProposal.insertId, mm.getSystemDate(), data.CLIENT_ID,resultsProposal.insertId, mm.getSystemDate(), data.CLIENT_ID], supportKey, connection, (error, resultHistory) => {

                                                                        if (error) {
                                                                            console.log(error);
                                                                            db.rollbackConnection(connection);
                                                                            res.send({
                                                                                "code": 400,
                                                                                "message": "Failed to update proposal information...",
                                                                                //"data": responseData
                                                                            });

                                                                        }
                                                                        else {
                                                                            // console.log(resultHistory);
  var logAction = 'Proposal Created';
                                                                            var description = `CONCAT((select NAME from user_master where ID = ${data.USER_ID}),' created new LOAN_TYPE proposal of amounting Rs.${data.LOAN_AMOUNT} in ',(select NAME_EN from branch_master where ID = ${data.BRANCH_ID}),' branch, Proposal reference number is ${LOAN_KEY}.')`;

                                                                            addLogs(data.PROPOSAL_ID, logAction, description, data.USER_ID, 0, 2, data.CLIENT_ID,supportKey);

                                                                            db.commitConnection(connection);
                                                                            // sendemail(EMAIL_ID, LOAN_AMMOUNT, userKey, supportKey, LOAN_KEY);
                                                                            res.send({
                                                                                "code": 200,
                                                                                "message": "आपले कर्ज प्रकरण नोंदणी पूर्ण झाली आहे.\nकृपया आपल्या सर्व कागदपत्रांची सॉफ्ट कॉपी तयार ठेवा.\nदस्तऐवज अपलोड मध्ये दिलेल्या यादी मधील सर्व कागदपत्रे उपलोड करावी.आपला कर्ज प्रकरण नोंदणी क्रमांक आहे - " + LOAN_KEY,
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

                            db.executeDML(`INSERT INTO applicant_master(NAME,MOBILE_NUMBER,REGISTRATION_DATETIME,LAST_OPENED_DATETIME,CLIENT_ID) values (?,?,?,?,?)`, [data.APPLICANT_NAME, data.MOBILE_NO1, mm.getSystemDate(), mm.getSystemDate(), data.CLIENT_ID], supportKey, connection, (error, resultsInsertApplicant) => {
                                if (error) {
                                    console.log(error)
                                    db.rollbackConnection(connection)
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to create proposal."
                                    })
                                }
                                else {

                                    generateCode(supportKey, (error, LOAN_KEY) => {
                                        if (error) {
                                            console.log(error);
                                            db.rollbackConnection(connection);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update proposal information...",

                                            });
                                        }
                                        else {
                                            var userKey = resultsInsertApplicant.insertId;

                                            db.executeDML(`insert into praposal_master(APPLICANT_ID,LOAN_TYPE_ID,LOAN_AMOUNT,LOAN_KEY,CLIENT_ID,PAN,AADHAR,PRAPOSAL_TYPE,BRANCH_ID) values (?,?,?,?,?,?,?,?,?)`, [userKey, data.LOAN_TYPE_ID, data.LOAN_AMOUNT, LOAN_KEY, data.CLIENT_ID, data.PAN, data.AADHAR, data.PRAPOSAL_TYPE,data.ASSING_BRANCH_ID], supportKey, connection, (error, resultsProposal) => {
                                                if (error) {
                                                    console.log(error);
                                                    db.rollbackConnection(connection)
                                                    res.send({
                                                        code: 400,
                                                        "message": "Failed to create proposal information"
                                                    })
                                                }
                                                else {
                                                    data.PROPOSAL_ID = resultsProposal.insertId;
                                                    db.executeDML(`insert into basic_form_details SET ?`, data, supportKey, connection, (error, resultsBasicForms) => {
                                                        if (error) {
                                                            console.log(error);
                                                            db.rollbackConnection(connection)
                                                            res.send({
                                                                code: 400,
                                                                "message": "Failed to create proposal"
                                                            })
                                                        }
                                                        else {

                                                            var documentQuery = ``;
                                                            if (data.PRAPOSAL_TYPE.trim() == 'वैयक्तिक') {


                                                                if (data.INCOME_SOURCE == 1) {

                                                                    documentQuery = `INSERT INTO applicant_documents (PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES
                                                                (${resultsProposal.insertId},1,'पॅनकार्ड','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},2,'आधारकार्ड','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},3,'अर्जदाराचा फोटो','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},4,'पगार स्लिप','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},5,'बँक पासबुक (latest 6 month entries)','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},6,'इनकम टैक्स रिटर्न (लेटेस्ट)','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},7,'फॉर्म 16','',0,1,'B',${userKey})`;
                                                                }
                                                                else if (data.INCOME_SOURCE == 2 || data.INCOME_SOURCE == 4) {

                                                                    documentQuery = `INSERT INTO applicant_documents (PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES
                                                                (${resultsProposal.insertId},1,'पॅनकार्ड','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},2,'आधारकार्ड','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},3,'अर्जदाराचा फोटो','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},8,'GST नोंदणी प्रमाणपत्र','',0,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},9,'दूकाने अभिनियम परवाना','',0,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},6,'इनकम टैक्स रिटर्न (लेटेस्ट)','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},10,'मागील वर्षाची बॅलेंन्स शीट','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},11,'मागील वर्षाचे प्रॉफिट- लॉस / रिसिप्ट पेमेंट अकाउंट स्टेटमेंट','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},12,'मागील वर्षाचे कॅपिटल अकाउंट स्टेटमेंट','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},13,'स्टॉक स्टेटमेंट (लेटेस्ट)','',0,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},14,'व्यवसाय ठिकाणाचा फोटो','',1,1,'B',${userKey})`;
                                                                }
                                                                else if (data.INCOME_SOURCE == 3) {

                                                                    documentQuery = `INSERT INTO applicant_documents (PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES
                                                                (${resultsProposal.insertId},1,'पॅनकार्ड','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},2,'आधारकार्ड','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},3,'अर्जदाराचा फोटो','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},15,'8-अ  उतारा','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},16,'7/12 उतारा','',1,1,'B',${userKey}),
                                                                (${resultsProposal.insertId},17,'उत्पन्नाचा दाखला','',1,1,'B',${userKey})`;
                                                                }
                                                            }
                                                            else {
                                                                documentQuery = `INSERT INTO applicant_documents (PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES
                                                            (${resultsProposal.insertId},1,'पॕनकार्ड','',1,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},8,'GST नोंदणी प्रमाणपत्र','',0,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},19,'संस्था नोंदणी प्रमाणपत्र','',0,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},6,'इनकम टैक्स रिटर्न (लेटेस्ट)','',1,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},18,'इनकम टैक्स कॉम्प्यूटेशन','',1,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},10,'मागील वर्षाची बॅलेंन्स शीट','',1,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},11,'मागील वर्षाचे प्रॉफिट- लॉस / रिसिप्ट पेमेंट अकाउंट स्टेटमेंट','',1,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},12,'मागील वर्षाचे कॅपिटल अकाउंट स्टेटमेंट','',0,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},13,'स्टॉक स्टेटमेंट (लेटेस्ट)','',0,1,'B',${userKey}),
                                                            (${resultsProposal.insertId},14,'व्यवसाय ठिकाणाचा फोटो','',1,1,'B',${userKey})`;

                                                            }

                                                            db.executeDML(documentQuery, '', supportKey, connection, (error, resultsInsertDocument) => {
                                                                if (error) {
                                                                    console.log(error);
                                                                    db.rollbackConnection(connection)
                                                                    req.send({
                                                                        code: 400,
                                                                        "message": "Failed to create proposal information"
                                                                    })
                                                                }
                                                                else {

                                                                    db.executeDML(`call spAddPraposalInformation(?)`, [resultsProposal.insertId], supportKey, connection, (error, resultsSp) => {
                                                                        if (error) {
                                                                            console.log(error);
                                                                            db.rollbackConnection(connection);
                                                                            res.send({
                                                                                "code": 400,
                                                                                "message": "Failed to update proposal information...",
                                                                                //"data": responseData
                                                                            });
                                                                        }
                                                                        else {
                                                                            console.log(resultsSp);
                                                                            db.executeDML(`insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,IS_COMPLETED,COMPLETED_ON_DATETIME,CLIENT_ID) values (?,1,2,?,?),(?,2,0,?,?)`, [resultsProposal.insertId, mm.getSystemDate(), data.CLIENT_ID,resultsProposal.insertId, mm.getSystemDate(), data.CLIENT_ID], supportKey, connection, (error, resultHistory) => {
                                                                                if (error) {
                                                                                    console.log(error);
                                                                                    db.rollbackConnection(connection);
                                                                                    res.send({
                                                                                        "code": 400,
                                                                                        "message": "Failed to update proposal information...",
                                                                                        //"data": responseData
                                                                                    });

                                                                                }
                                                                                else {
                                                                                    // console.log(resultHistory);
										  var logAction = 'Proposal Created';
                                                                            var description = `CONCAT((select NAME from user_master where ID = ${data.USER_ID}),' created new LOAN_TYPE proposal of amounting Rs.${data.LOAN_AMOUNT} in ',(select NAME_EN from branch_master where ID = ${data.BRANCH_ID}),' branch, Proposal reference number is ${LOAN_KEY}.')`;

                                                                            addLogs(data.PROPOSAL_ID, logAction, description, data.USER_ID, 0, 2, data.CLIENT_ID,supportKey);



                                                                                    db.commitConnection(connection);
                                                                                    // sendemail(EMAIL_ID, LOAN_AMMOUNT, userKey, supportKey, LOAN_KEY);
                                                                                    res.send({
                                                                                        "code": 200,
                                                                                        "message": "आपले कर्ज प्रकरण नोंदणी पूर्ण झाली आहे.\nकृपया आपल्या सर्व कागदपत्रांची सॉफ्ट कॉपी तयार ठेवा.\nदस्तऐवज अपलोड मध्ये दिलेल्या यादी मधील सर्व कागदपत्रे उपलोड करावी.आपला कर्ज प्रकरण नोंदणी क्रमांक आहे - " + LOAN_KEY,
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

                    }
                })
            }
        });

    } catch (error) {
        console.log(error)
        db.rollbackConnection(connection);
        res.send({
            "code": 400,
            "message": "Failed to update proposal information..."
        });
    }
}


function generateCode(supportKey, callback) {

    var code = mm.generateKeyNumber(6);

    mm.executeQuery(`select * from praposal_master where LOAN_KEY like '%-${code}' `, supportKey, (error, results) => {
        if (error) {
            console.log(error);
            generateCode(supportKey, callback)
        }
        else {
            if (results.length > 0) {
                generateCode(supportKey, callback)
            }
            else {
                callback(null, code)
            }
        }
    });

    return;
}


function addLogs(PROPOSAL_ID, LOG_ACTION, DESCRIPTION, USER_ID, OLD_STAGE_ID, NEW_STAGE_ID, CLIENT_ID,supportKey) {
    try {
        mm.executeQuery(`insert into  proposal_log_information(PROPOSAL_ID,LOG_ACTION,DESCRIPTION,LOG_DATETIME,LOG_TYPE,USER_ID,OLD_STAGE_ID,NEW_STAGE_ID,CLIENT_ID) values (${PROPOSAL_ID},'${LOG_ACTION}',${DESCRIPTION},'${mm.getSystemDate()}','I',${USER_ID},${OLD_STAGE_ID},${NEW_STAGE_ID},${CLIENT_ID})`, supportKey, (error, results) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(results);
            }
        });
    } catch (error) {
        console.log(error);
    }
}