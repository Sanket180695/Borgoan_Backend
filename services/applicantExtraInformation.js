const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var applicantExtraInformation = "applicant_extra_information";
var viewApplicantExtraInformation = "view_" + applicantExtraInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        EXTRA_INFORMATION_ID: req.body.EXTRA_INFORMATION_ID,
        IS_PROVIDED: req.body.IS_PROVIDED ? '1' : '0',
        IS_PROVIDED_NULL: req.body.IS_PROVIDED_NULL ? '1' : '0',
        PROVIDED_DATETIME: req.body.PROVIDED_DATETIME,
        IS_COMPLUSORY: req.body.IS_COMPLUSORY ? '1' : '0',
        IS_VERIFIED: req.body.IS_VERIFIED ? '1' : '0',
        IS_APPROVED: req.body.IS_APPROVED ? '1' : '0',
        REMARK: req.body.REMARK,
        USER_ID: req.body.USER_ID,
        CLIENT_ID: req.body.CLIENT_ID,
        TYPE: req.body.TYPE,
        APPLICANT_ID: req.body.APPLICANT_ID,
	VERIFICATION_DATETIME: req.body.IS_VERIFIED?mm.getSystemDate():null

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('EXTRA_INFORMATION_ID').isInt(),
        body('PROVIDED_DATETIME').optional(),
        body('REMARK').optional(),
        body('USER_ID').isInt().optional(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewApplicantExtraInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get applicantExtraInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewApplicantExtraInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get applicantExtraInformation information."
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
            mm.executeQueryData('INSERT INTO ' + applicantExtraInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save applicantExtraInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ApplicantExtraInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + applicantExtraInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update applicantExtraInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ApplicantExtraInformation information updated successfully...",
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







exports.getApplicantExtraInformation = (req, res) => {
    try {
        var PRAPOSAL_ID = req.body.PRAPOSAL_ID;
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0
        var supportKey = req.headers['supportkey']

        if (PRAPOSAL_ID) {


            var query = `select m.*,
            (select if(count(*) > 0,1,0) from view_applicant_extra_information where  EXTRA_INFORMATION_ID = m.ID AND PROPOSAL_ID = ${PRAPOSAL_ID} and TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + `) AS IS_SELECTED,
            ifnull((select IS_PROVIDED from view_applicant_extra_information where  EXTRA_INFORMATION_ID = m.ID AND PROPOSAL_ID =  ${PRAPOSAL_ID} and TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + `),0) AS IS_PROVIDED,
            ifnull((select IS_PROVIDED_NULL from view_applicant_extra_information where  EXTRA_INFORMATION_ID = m.ID AND PROPOSAL_ID =  ${PRAPOSAL_ID} and TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + `),0) AS IS_PROVIDED_NULL,
            ifnull((select PROVIDED_DATETIME from view_applicant_extra_information where  EXTRA_INFORMATION_ID = m.ID AND PROPOSAL_ID =  ${PRAPOSAL_ID} and TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + `),0) AS PROVIDED_DATETIME,
            ifnull((select IS_COMPLUSORY from view_applicant_extra_information where  EXTRA_INFORMATION_ID = m.ID AND PROPOSAL_ID =  ${PRAPOSAL_ID} and TYPE ='${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + `),0)  AS IS_COMPULSORY,
            ifnull((select IS_VERIFIED from view_applicant_extra_information where  EXTRA_INFORMATION_ID = m.ID AND PROPOSAL_ID =  ${PRAPOSAL_ID} and TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + `),0) AS IS_VERIFIED,
            ifnull((select IS_APPROVED from view_applicant_extra_information where  EXTRA_INFORMATION_ID = m.ID AND PROPOSAL_ID =  ${PRAPOSAL_ID} and TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + `),0) AS IS_APPROVED,
            ifnull((select REMARK from view_applicant_extra_information where  EXTRA_INFORMATION_ID = m.ID AND PROPOSAL_ID =  ${PRAPOSAL_ID} and TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + `),'') AS REMARK
            from view_extra_information m WHERE STATUS = 1 order by SEQ_NO`;


            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update applicantExtraInformation information.",
                    });

                }
                else {

                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": results
                    });
                }
            })


        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter Missing- PraposalId",
            });

        }
    } catch (error) {
        console.log(error)
    }
}



var async = require('async')

exports.addExtraInformation = (req, res) => {
    try {
        var data = req.body.data;

        var supportKey = req.headers['supportkey'];
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0
        var deviceId = req.headers['deviceid'];
        var PRAPOSAL_ID = req.body.PRAPOSAL_ID;
        var USER_ID = req.body.USER_ID;


        if (PRAPOSAL_ID && data && USER_ID) {

            var connection = db.openConnection();
            //instructionData.ASSIGNMENT_ID = ASSIGNMENT_ID;
            // var dataRecord = reqDataBranch(instructionData);

            async.eachSeries(data, function iteratorOverElems(dataItem, callback) {

                db.executeDML(`select * FROM applicant_extra_information where PROPOSAL_ID = '${PRAPOSAL_ID}' and  EXTRA_INFORMATION_ID = ${dataItem.ID} and TYPE = '${TYPE}' ` + (TYPE!='B' ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``), '', supportKey, connection, (error, results) => {
                    if (error) {
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);

                        console.log(error)
                        callback(error);

                    }
                    else {

                        if (results.length > 0) {

                            if (dataItem.IS_SELECTED) {
                                db.executeDML(`update applicant_extra_information set IS_COMPLUSORY= ${dataItem.IS_COMPULSORY}  WHERE ID = ${results[0].ID}`, '', supportKey, connection, (error, resultsUpdate) => {
                                    if (error) {
                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);

                                        console.log(error)
                                        callback(error);

                                    }
                                    else {

                                        callback();

                                    }
                                });
                            }
                            else {
                                db.executeDML(`delete from applicant_extra_information WHERE ID = ${results[0].ID}`, '', supportKey, connection, (error, resultsDelete) => {
                                    if (error) {
                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);

                                        console.log(error)
                                        callback(error);

                                    }
                                    else {

                                        callback();

                                    }
                                });
                            }


                        }
                        else {

                            if (dataItem.IS_SELECTED) {
                                db.executeDML(`INSERT INTO applicant_extra_information (PROPOSAL_ID,EXTRA_INFORMATION_ID,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID)  VALUES (${PRAPOSAL_ID},${dataItem.ID},${dataItem.IS_COMPULSORY},${dataItem.CLIENT_ID},'${TYPE}',${APPLICANT_ID})`, '', supportKey, connection, (error, resultsInsert) => {
                                    if (error) {
                                        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);

                                        console.log(error)
                                        callback(error);

                                    }
                                    else {

                                        callback();
                                    }
                                });
                            }
                            else {
                                callback()
                            }
                        }
                    }
                });

            },
                function subCb(error) {
                    if (error) {
                        //rollback
                        console.log(error);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to create Extra Applicant details information..."
                        });
                    } else {

                        db.executeDML(`UPDATE praposal_master SET CURRENT_STAGE_ID = 8 ,CURRENT_STAGE_DATETIME = '${mm.getSystemDate()}', LAST_UPDATED_ON_DATETIME = '${mm.getSystemDate()}' where ID = ${PRAPOSAL_ID} `, '', supportKey, connection, (error, resultsPraposal) => {
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

                                db.executeDML(`select * from  praposal_stage_history  where PROPOSAL_ID = ${PRAPOSAL_ID}  AND STAGE_ID = 8`, '', supportKey, connection, (error, results1Praposal) => {
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

                                        if (results1Praposal.length > 0) {
  var  logAction =`Proposal has mapped additional information tabs.`;
                                                            var logDescription = `concat((select NAME from user_master where ID = ${USER_ID}),' has mapped additional information to the proposal ',(SELECT LOAN_KEY FROM PROPOSAL_MASTER WHERE ID=${PRAPOSAL_ID}))`;
                                                       
                                                             addLogs(PRAPOSAL_ID,logAction,logDescription,USER_ID,7,8,1,supportKey)
                                            db.commitConnection(connection);
                                            res.send({
                                                "code": 200,
                                                "message": "Extra Applicant details information updated successfully."
                                            });
                                        }
                                        else {

                                            var query = `UPDATE praposal_stage_history set IS_COMPLETED = 1 ,REMARKS = '',COMPLETED_ON_DATETIME= '${mm.getSystemDate()}' WHERE PROPOSAL_ID = ${PRAPOSAL_ID} AND IS_COMPLETED = 0`;

                                            db.executeDML(query, '', supportKey, connection, (error, resultsInsertHistory) => {
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

                                                    var query = `insert into praposal_stage_history(PROPOSAL_ID,STAGE_ID,REMARKS,IS_COMPLETED,USER_ID,CLIENT_ID) values (${PRAPOSAL_ID},8,'',0,0,1)`

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
  var  logAction =`Proposal has mapped additional information tabs.`;
                                                            var logDescription = `concat((select NAME from user_master where ID = ${USER_ID}),' has mapped additional information to the proposal ',(SELECT LOAN_KEY FROM PROPOSAL_MASTER WHERE ID=${PRAPOSAL_ID}))`;
                                                       
                                                             addLogs(PRAPOSAL_ID,logAction,logDescription,USER_ID,7,8,1,supportKey)
                                                            db.commitConnection(connection);
                                                            res.send({
                                                                "code": 200,
                                                                "message": "Extra Applicant details information updated successfully."
                                                            });

                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });

                            }
                        });
                    }
                });

        } else {

            res.send({
                "code": 400,
                "message": "ASSIGNMENT_ID or data parameter missing"
            });

        }
    } catch (error) {
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

        //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }
}







function addLogs(PROPOSAL_ID, LOG_ACTION, DESCRIPTION, USER_ID, OLD_STAGE_ID, NEW_STAGE_ID, CLIENT_ID,supportKey) {
    try {
        mm.executeQuery(`insert into proposal_log_information(PROPOSAL_ID,LOG_ACTION,DESCRIPTION,LOG_DATETIME,LOG_TYPE,USER_ID,OLD_STAGE_ID,NEW_STAGE_ID,CLIENT_ID) values (${PROPOSAL_ID},'${LOG_ACTION}',${DESCRIPTION},'${mm.getSystemDate()}','I',${USER_ID},${OLD_STAGE_ID},${NEW_STAGE_ID},${CLIENT_ID})`, supportKey, (error, results) => {
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




