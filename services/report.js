const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;


exports.getBranchProposalcountReport = (req, res) => {
    try {

        var from_date = req.body.FROM_DATE ? req.body.FROM_DATE : '';
        var to_date = req.body.TO_DATE ? req.body.TO_DATE : '';
        var STAGE_IDS = req.body.STAGE_IDS ? req.body.STAGE_IDS : '';

        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        var filter = '1 ' + (from_date && to_date ? ` and CREATED_ON_DATETIME between ${from_date} and ${to_date} ` : '') + (STAGE_IDS ? ` AND CURRENT_STAGE_ID IN (${STAGE_IDS})` : '');

        filter = filter ? filter : '';

    
        var query = `CALL spGetBranchLoantypeCountReport("${filter}")`;

        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get report.",
                });
            }
            else {

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results[0]
                });

            }
        })

    } catch (error) {
        console.log(error);
    }
}

exports.getBranchProposalAmountReport = (req, res) => {
    try {

        var from_date = req.body.FROM_DATE ? req.body.FROM_DATE : '';
        var to_date = req.body.TO_DATE ? req.body.TO_DATE : '';
        var STAGE_IDS = req.body.STAGE_IDS ? req.body.STAGE_IDS : '';

        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        var filter = '1' + (from_date && to_date ? ` and CREATED_ON_DATETIME between ${from_date} and ${to_date} ` : '') + (STAGE_IDS ?  ` AND CURRENT_STAGE_ID IN (${STAGE_IDS})` :'');

        filter = filter ? filter : '';

    
        var query = `CALL spGetBranchLoantypeAmountReport("${filter}")`;

        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get report.",
                });
            }
            else {
                console.log(results);
                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results[0]
                });

            }
        })

    } catch (error) {
        console.log(error);
    }
}

exports.getBranchStageProposalcountReport = (req, res) => {
    try {

        var from_date = req.body.FROM_DATE ? req.body.FROM_DATE : '';
        var to_date = req.body.TO_DATE ? req.body.TO_DATE : '';
        var LOAN_TYPES = req.body.LOAN_TYPES ? req.body.LOAN_TYPES : '';

        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        var filter = '1' + (from_date && to_date ? ` and CREATED_ON_DATETIME between '${from_date}' and '${to_date}' ` : '') + (LOAN_TYPES ? ` AND LOAN_TYPE_ID IN (${LOAN_TYPES})` :`` );


        filter = filter ? filter : '';

        var query = `CALL spGetBranchStageCountReport("${filter}")`;

        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get report.",
                });
            }
            else {

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results[0]
                });

            }
        })

    } catch (error) {
        console.log(error);
    }
}

exports.getBranchStageProposalAmountReport = (req, res) => {
    try {

        var from_date = req.body.FROM_DATE ? req.body.FROM_DATE : '';
        var to_date = req.body.TO_DATE ? req.body.TO_DATE : '';
        var LOAN_TYPES = req.body.LOAN_TYPES ? req.body.LOAN_TYPES : '';

        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        var filter = '1' + (from_date && to_date ? ` and CREATED_ON_DATETIME between '${from_date}' and '${to_date}' ` : '') + (LOAN_TYPES ?  ` AND LOAN_TYPE_ID IN (${LOAN_TYPES})` :``);

        filter = filter ? filter : '';

        var query = `CALL spGetBranchStageAmountReport("${filter}")`;

        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get report.",
                });
            }
            else {

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results[0]
                });

            }
        })

    } catch (error) {
        console.log(error);
    }
}



exports.getBranchLoanTypeStageProposalAmountReport = (req, res) => {
    try {

        var from_date = req.body.FROM_DATE ? req.body.FROM_DATE : '';
        var to_date = req.body.TO_DATE ? req.body.TO_DATE : '';
        var BRANCH_ID = req.body.BRANCH_ID ? req.body.BRANCH_ID : 0;

        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        var filter = '' + (from_date && to_date ? `1 and CREATED_ON_DATETIME between '${from_date}' and '${to_date}' ` : '') + (BRANCH_ID ? '' : ` AND BRANCH_ID IN (${BRANCH_ID})`);


        filter = filter ? filter : '';

        var query = `CALL spGetBranchLoanTypeStageAmountReport(${filter})`;

        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get report.",
                });
            }
            else {

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results[0]
                });

            }
        })

    } catch (error) {
        console.log(error);
    }
}

exports.getBranchLoanTypeStageProposalcountReport = (req, res) => {
    try {

        var from_date = req.body.FROM_DATE ? req.body.FROM_DATE : '';
        var to_date = req.body.TO_DATE ? req.body.TO_DATE : '';
        var BRANCH_ID = req.body.BRANCH_ID ? req.body.BRANCH_ID : 0;

        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        var filter = '' + (from_date && to_date ? `1 and CREATED_ON_DATETIME between '${from_date}' and '${to_date}' ` : '') + (BRANCH_ID ? '' : ` AND BRANCH_ID IN (${BRANCH_ID})`);

        filter = filter ? filter : '';

        var query = `CALL spGetBranchLoanTypeStageCountReport(${filter})`;

        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get report.",
                });
            }
            else {

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results[0]
                });

            }
        })

    } catch (error) {
        console.log(error);
    }
}

var async = require('async');
exports.sendSchedularReports = (req, res) => {
    try {

        var reportId = req.body.REPORT_SCHEDULAR_ID;
        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        if (reportId) {
            var query = `select * from view_report_schedular where ID = ?`;
            console.log(req.body)
            mm.executeQueryData(query, [reportId], supportKey, (error, results1) => {
                if (error) {
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);

                    res.send({
                        "code": 400,
                        "message": "Failed to get stage count Report"
                    });
                }
                else {

                    if (results1.length > 0) {

                        var params = JSON.parse(results1[0].PARAMETERS)


                        var request = require('request');

                        // console.log("email key ", process.env.EMAIL_SERVER_KEY)

                        var options = {
                            url: 'http://borgaon.tecpool.in:3924/schedularReport/'+results1[0].SP_NAME,
                            headers: {
                                "apikey": process.env.APIKEY,
                                "supportkey": process.env.SUPPORT_KEY,
                               "token":""
                                //"applicationkey": process.env.APPLICATION_KEY
                            },
                            body: params,
                            json: true
                        }

                        request.post(options, (error, response, body) => {
                            if (error) {
                                console.log("request error -send email ", error);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                                // db.rollbackConnection(connection);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to send reports..."
                                });
                            } else {
                                console.log("here :",body);

                                var EMAIL_IDS = results1[0].EMAIL_IDS.split(',');
                                console.log(body)
                                var tablehead = `<tr>`, tableText = ``;
                                Object.keys(body.data[0]).forEach(key => {
                                    tablehead += `<th>${key.toLowerCase().replace(/\_/g, ' ')}</th>`
                                });

                                for (let i = 0; i < body.data.length; i++) {
                                    const item = body.data[i];
                                    tableText += `<tr>`

                                    Object.keys(item).forEach(key => {
                                        tableText += `<td>${item[key]}</td>`
                                    });

                                    tableText += `</tr>`
                                }

                              
                                tablehead += `</tr>`

                                var subject = `Loan ProSys Report:Weekly Report- ${results1[0].NAME} run at ${mm.getSystemDate()} `;
                                var emailText = `<html><head><style type="text/css">
                                .tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color: #729ea5;border-collapse: collapse;}
                                .tftable th {font-size:12px;background-color:#acc8cc;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;text-align:left;}
                                .tftable tr {background-color:#d4e3e5;}
                                .tftable td {font-size:12px;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;}
                                .tftable tr:hover {background-color:#ffffff;}
                                </style></head>
<body>				<p>Dear user, ${results1[0].NAME} is Generated at ${new Date().toLocaleString()}. </p>                                
                                <table class="tftable" border="1">
                                ${tablehead}
                                ${tableText}                                
                                </table>
</body></html>
                                `;


                                async.eachSeries(EMAIL_IDS, function iteratorOverElems(emailId, callback) {
                                    mm.sendEmail(emailId, subject, emailText, (error, resultsemail) => {
                                        if (error) {

                                            callback(error);

                                        }
                                        else {

                                            callback();

                                        }
                                    });

                                }, function subCb(error) {
                                    if (error) {
                                        //rollback
                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                                        // db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to send reports..."
                                        });

                                    } else {

                                        res.send({
                                            "code": 200,
                                            "message": "Reports are generated and emailed to users successfully.",

                                        });

                                    }
                                });
                            }
                        });

                    }
                    else {
                        //No data generated 
                        res.send({
                            "code": 200,
                            "message": "success",
                            //"data": results
                        });
                    }
                }
            })

        }
        else {
            res.send({
                "code": 400,
                "message": "parameter missing - report id"
            });
        }
    } catch (error) {
        console.log(error);
    }
}


var async =require('async');
exports.sendSchedularReports1 = (req, res) => {
    try {

        var reportId = req.body.REPORT_SCHEDULAR_ID;
  var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        if (reportId) {
            var query = `select * from view_report_schedular where ID = ?`;
		console.log(req.body)
            mm.executeQueryData(query, [reportId], supportKey, (error, results1) => {
                if (error) {
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);

                    res.send({
                        "code": 400,
                        "message": "Failed to get stage count Report"
                    });
                }
                else {
console.log()
                    if (results1.length > 0) {
		
                        var params = JSON.parse(results1[0].PARAMETERS)
                        var filter = '';
                   //     if (reportId == 1) {
                     //       filter = '' + (params.FROM_DATE && params.TO_DATE ? ` and CREATED_ON_DATETIME between ${params.FROM_DATE} and ${params.TO_DATE} ` : '') + (params.STAGE_IDS ? '' : ` AND CURRENT_STAGE_ID IN (${params.STAGE_IDS})`);
                       // }

                          var query1 = `call ${results1[0].SP_NAME}("${params.filter}")`
                        mm.executeQueryData(query1, [reportId], supportKey, (error, results) => {
                            if (error) {
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                console.log(error);

                                res.send({
                                    "code": 400,
                                    "message": "Failed to get stage count Report"
                                });
                            }
                            else {
                                //send email 
			
                                var EMAIL_IDS = results1[0].EMAIL_IDS.split(',');
console.log(results[0][0])
                                var tablehead = `<tr>`, tableText = ``;
 					 Object.keys(results[0][0]).forEach(key => {
                                        tablehead += `<th>${key.toLowerCase().replace(/\_/g, ' ')}</th>`
                                         });
				
                                for (let i = 0; i < results[0].length; i++) {
                                    const item = results[0][i];
                                    tableText += `<tr>`
					
 					Object.keys(item).forEach(key => {
                                        tableText += `<td>${item[key]}</td>`
                                         });
                                     
                                    tableText += `</tr>`
                                }

				console.log(results,tablehead,tableText)
                                tablehead += `</tr>`

                                var subject  = `Loan ProSys Report:Weekly Report- ${results1[0].NAME} run at ${mm.getSystemDate()} `;
                                var emailText = `<html><head><style type="text/css">
                                .tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color: #729ea5;border-collapse: collapse;}
                                .tftable th {font-size:12px;background-color:#acc8cc;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;text-align:left;}
                                .tftable tr {background-color:#d4e3e5;}
                                .tftable td {font-size:12px;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;}
                                .tftable tr:hover {background-color:#ffffff;}
                                </style></head>
<body>				<p>Dear user, ${results1[0].NAME} is Generated at ${new Date().toLocaleString()}. </p>                                
                                <table class="tftable" border="1">
                                ${tablehead}
                                ${tableText}                                
                                </table>
</body></html>
                                `;


                                async.eachSeries(EMAIL_IDS, function iteratorOverElems(emailId, callback) {
                                    mm.sendEmail(emailId, subject, emailText, (error, resultsemail) => {
                                        if (error) {

                                            callback(error);

                                        }
                                        else {

                                            callback();

                                        }
                                    });

                                }, function subCb(error) {
                                    if (error) {
                                        //rollback
                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                                        // db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to send reports..."
                                        });

                                    } else {

                                        res.send({
                                            "code": 200,
                                            "message": "Reports are generated and emailed to users successfully.",

                                        });

                                    }
                                });

                            }
                        });
                    }
                    else {
                        //No data generated 
                        res.send({
                            "code": 200,
                            "message": "success",
                            "data": results
                        });
                    }
                }
            })

        }
        else {
            res.send({
                "code": 400,
                "message": "parameter missing - report id"
            });
        }
    } catch (error) {
        console.log(error);
    }
}

//============================

exports.getPraposalDocumentList = (req, res) => {

    let PROPOSAL_ID = req.body.PROPOSAL_ID;
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;
    var query = `SELECT PROPOSAL_ID,DOCUMENT_TITLE,IS_COMPLUSORY_STATUS,IS_UPLOADED_STATUS,IS_VERIFIED_STATUS,REMARK,UPLOADED_DATETIME,VERIFICATION_DATETIME FROM view_applicant_documents WHERE PROPOSAL_ID=?;`;
    try {
        if (PROPOSAL_ID) {
            mm.executeQueryData(query, [PROPOSAL_ID], supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                    res.send({
                        "code": 400,
                        "message": "Failed to get praposalDocumentList information ...",
                    });
                }
                else {
                    // console.log(results);

                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": results
                    });
                }
            });
        } else {
            res.send({
                "code": 400,
                "message": "Parameter mising ...",
            });
        }

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getPraposalExtraInfoStatus = (req, res) => {

    let PROPOSAL_ID = req.body.PROPOSAL_ID;
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;
    var query = `SELECT PROPOSAL_ID,EXTRA_INFORMATION_NAME,NAME_EN,NAME_KN,IS_PROVIDED,
    CASE IS_APPROVED WHEN IS_APPROVED=0 && IS_VERIFIED=0 THEN 'Rejected' WHEN IS_APPROVED=0 && IS_VERIFIED=1 THEN 'Pending' WHEN IS_APPROVED=1 && IS_VERIFIED=1 THEN 'Approved' ELSE '' end VERIFICATION_STATUS,
    ifnull((SELECT NAME FROM user_master WHERE ID=view_applicant_extra_information.USER_ID),'')AS APPROVED_BY,REMARK,VERIFICATION_DATETIME FROM view_applicant_extra_information WHERE PROPOSAL_ID=? ;`;
    try {
        if (PROPOSAL_ID) {
            mm.executeQueryData(query, [PROPOSAL_ID], supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                    res.send({
                        "code": 400,
                        "message": "Failed to get praposalExtraInfoStatus information ...",
                    });
                }
                else {
                    // console.log(results);

                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": results
                    });
                }
            });
        } else {
            res.send({
                "code": 400,
                "message": "parameter missing ... "
            });
        }

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getPraposalSummary = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT ID,LOAN_KEY,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,CIBIL_SCORE,LOAN_AMOUNT,CURRENT_STAGE_ID,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN,
        ifnull(TIMESTAMPDIFF(DAY,CREATED_ON_DATETIME,(select CURRENT_STAGE_DATETIME FROM view_praposal_master where CURRENT_STAGE_ID=13)),0)PROCESSING_DAYS,
        (select count(*) from view_applicant_documents where PROPOSAL_ID=a.ID)AS DOCUMENTS_MAPPED,
        (select count(*) from view_applicant_documents where PROPOSAL_ID=a.ID AND IS_APPROVED=1)AS DOCUMENTS_APPROVED,
        (select count(*) from view_applicant_documents where PROPOSAL_ID=a.ID AND IS_VERIFIED=1 AND IS_APPROVED=0)AS DOCUMENTS_REJECTED,
        (select count(*) from view_applicant_documents where PROPOSAL_ID=a.ID AND IS_VERIFIED=0 AND IS_APPROVED=0)AS DOCUMENT_VERIFICATION_PENDING,
        
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID)AS TABS_MAPPED,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID AND IS_PROVIDED=1)AS TABS_PROVIDED,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID AND IS_VERIFIED=1)AS TABS_VERIFIED,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID AND IS_VERIFIED=1 AND IS_APPROVED=0)AS TABS_REJECTED,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID AND IS_VERIFIED=0 AND IS_APPROVED=0)AS TABS_PENDING,
		ifnull((SELECT STATUS FROM view_payment_transaction WHERE PROPOSAL_ID=a.ID),'P')AS FEE_STATUS,
		ifnull((SELECT AMOUNT FROM view_payment_transaction WHERE PROPOSAL_ID=a.ID),0)AS FEE_AMOUNT
			FROM view_praposal_master as a where 1 ${filter} ;`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get praposalSummary information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getPraposalDocumentSummary = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT ID,LOAN_KEY,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,CIBIL_SCORE,LOAN_AMOUNT,CURRENT_STAGE_ID,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN,
    (select count(*) from view_applicant_documents where PROPOSAL_ID=a.ID)AS DOCUMENTS_MAPPED,
    (select count(*) from view_applicant_documents where PROPOSAL_ID=a.ID AND IS_APPROVED=1)AS DOCUMENTS_APPROVED,
    (select count(*) from view_applicant_documents where PROPOSAL_ID=a.ID AND IS_VERIFIED=1 AND IS_APPROVED=0)AS DOCUMENTS_REJECTED,
    (select count(*) from view_applicant_documents where PROPOSAL_ID=a.ID AND IS_VERIFIED=0 AND IS_APPROVED=0)AS DOCUMENT_VERIFICATION_PENDING FROM view_praposal_master a WHERE 1 ${filter} ;`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get praposalDocumentSummary information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getPraposalExtraInfoSummary = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT ID,LOAN_KEY,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,CIBIL_SCORE,LOAN_AMOUNT,CURRENT_STAGE_ID,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID)AS TABS_MAPPED,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID AND IS_PROVIDED=1)AS TABS_PROVIDED,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID AND IS_VERIFIED=1)AS TABS_VERIFIED,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID AND IS_VERIFIED=1 AND IS_APPROVED=0)AS TABS_REJECTED,
        (select count(*) from view_applicant_extra_information where PROPOSAL_ID=a.ID AND IS_VERIFIED=0 AND IS_APPROVED=0)AS TABS_PENDING FROM view_praposal_master as a where 1 ${filter} ;`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get praposalExtraInfoSummary information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getPraposalCibilSummary = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT ID,LOAN_KEY,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,CIBIL_SCORE,LOAN_AMOUNT,
    CURRENT_STAGE_ID,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN,CIBIL_REMARK FROM view_praposal_master WHERE 1 ${filter} ;`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get praposalCibilSummary information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getBranchPraposalList = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT ID,LOAN_KEY,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,LOAN_AMOUNT,CURRENT_STAGE_ID,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN,APPLICANT_NAME,MOBILE_NUMBER FROM view_praposal_master WHERE 1 ${filter} ;`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get branchPraposalList information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getApplicantMaster = (req, res) => {

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT ID AS APPLICANT_ID,NAME AS APPLICANT_NAME,
    (select COUNT(*) FROM view_praposal_master where APPLICANT_ID=a.ID)AS PRAPOSAL_COUNT,
    (select count(*) from view_applicant_documents where APPLICANT_ID=a.ID)AS DOCUMENTS_MAPPED,
    (select count(*) from view_applicant_documents where APPLICANT_ID=a.ID AND IS_UPLOADED=1)AS DOCUMENTS_UPLOADED FROM view_applicant_master a ;`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get applicantMaster information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getUserSummary = (req, res) => {

    let FROM_DATE = req.body.FROM_DATE;
    let TO_DATE = req.body.TO_DATE;

    var filter = '' + (FROM_DATE && TO_DATE ? ` AND CREATED_MODIFIED_DATE between '${FROM_DATE}' and '${TO_DATE}' ` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT NAME,STATUS,LAST_LOGIN_DATETIME,ifnull((SELECT NAME_MR FROM view_branch_master WHERE ID=u.BRANCH_ID),'')AS NAME_MR,ifnull((SELECT NAME_EN FROM view_branch_master WHERE ID=u.BRANCH_ID),'')AS NAME_EN,ifnull((SELECT NAME_KN FROM view_branch_master WHERE ID=u.BRANCH_ID),'')AS NAME_KN,(SELECT NAME FROM view_role_master WHERE ID=u.ROLE_ID)AS ROLE_NAME,(SELECT COUNT(*) FROM basic_form_details where USER_ID=u.ID)AS PRAPOSAL_COUNT,(SELECT COUNT(*) FROM view_user_activity_log WHERE USER_ID=u.ID)AS USER_ACTIVITY_COUNT FROM view_user_master u WHERE 1 ${filter};`;
    try {

        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get userSummary information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getPraposalStageHistory = (req, res) => {
    var PROPOSAL_ID = req.body.PROPOSAL_ID;

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT NAME_MR,NAME_EN,NAME_KN,STAGE_STARTED_DATETIME,COMPLETED_ON_DATETIME,ifnull(TIMESTAMPDIFF(DAY,STAGE_STARTED_DATETIME,COMPLETED_ON_DATETIME),0)AS DAYS FROM view_praposal_stage_history WHERE PROPOSAL_ID=?;`;

    try {
        if (PROPOSAL_ID) {
            mm.executeQueryData(query, [PROPOSAL_ID], supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                    res.send({
                        "code": 400,
                        "message": "Failed to get praposalSummary information ...",
                    });
                }
                else {
                    // console.log(results);

                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": results
                    });
                }
            });
        } else {
            res.send({
                "code": 400,
                "message": "parameter missing ... "
            });
        }

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getRoleMaster = (req, res) => {
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT view_role_master.NAME,ifnull(u.ACTIVE_USERS,0)AS ACTIVE_USERS FROM (view_role_master left join (select ROLE_ID,count(*)AS ACTIVE_USERS from view_user_master where IS_ACTIVE=1 GROUP BY ROLE_ID)u on u.ROLE_ID=view_role_master.ID);`;

    try {

        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get roleMaster information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });


    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getPrioritySectorLoan = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND p.LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT LOAN_KEY,APPLICANT_NAME,MOBILE_NUMBER,p.LOAN_AMOUNT,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN FROM view_praposal_master p JOIN view_loan_demand l ON FIND_IN_SET(p.ID,l.PROPOSAL_ID) AND l.PRIORITY_CODE_ID!=0 AND l.PRIORITY_CODE_ID IS NOT NULL ${filter};`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get prioritySectorLoan information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getWeakerSectionLoan = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND p.LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT LOAN_KEY,APPLICANT_NAME,MOBILE_NUMBER,p.LOAN_AMOUNT,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN FROM view_praposal_master p JOIN view_loan_demand l ON FIND_IN_SET(p.ID,l.PROPOSAL_ID) AND l.WEEKER_SECTION_ID!=0 AND l.WEEKER_SECTION_ID IS NOT NULL ${filter};`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get weakerSectionLoan information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getIndustrialMarkingLoan = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND p.LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT LOAN_KEY,APPLICANT_NAME,MOBILE_NUMBER,p.LOAN_AMOUNT,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN FROM view_praposal_master p JOIN view_loan_demand l ON FIND_IN_SET(p.ID,l.PROPOSAL_ID) AND l.INDUSTRY_CODE_ID!=0 AND l.INDUSTRY_CODE_ID IS NOT NULL ${filter};`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get industrialMarkingLoan information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getRealEstateMarkingLoan = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND p.LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT LOAN_KEY,APPLICANT_NAME,MOBILE_NUMBER,p.LOAN_AMOUNT,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,CURRENT_STAGE_NAME,STAGE_NAME_EN,STAGE_NAME_KN FROM view_praposal_master p JOIN view_loan_demand l ON FIND_IN_SET(p.ID,l.PROPOSAL_ID) AND l.REAL_ESTATE_MARKING!='NA' AND l.REAL_ESTATE_MARKING IS NOT NULL AND l.REAL_ESTATE_MARKING!='' ${filter};`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get realEstateMarkingLoan information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getScrutinyFeeCollected = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    var CURRENT_STAGE_ID = req.body.CURRENT_STAGE_ID;
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (CURRENT_STAGE_ID ? `AND CURRENT_STAGE_ID=${CURRENT_STAGE_ID}` : '') + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '') + (LOAN_TYPE_ID ? ` AND p.LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT LOAN_KEY,BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,
        (SELECT AMOUNT FROM view_payment_transaction WHERE IS_PAYMENT_DONE=1 AND PROPOSAL_ID=p.ID)AS AMOUNT FROM view_praposal_master p WHERE ID IN (SELECT PROPOSAL_ID FROM view_payment_transaction WHERE IS_PAYMENT_DONE=1) ${filter};`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get realEstateMarkingLoan information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}


exports.getBranchWiseScrutinyFeeCollection = (req, res) => {
    var BRANCH_ID = req.body.BRANCH_ID;

    var filter = '' + (BRANCH_ID ? ` AND BRANCH_ID=${BRANCH_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `select BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,
    (select SUM(AMOUNT) from view_payment_transaction where IS_PAYMENT_DONE=1 AND BRANCH_NAME=view_praposal_master.BRANCH_NAME)AS COLLECTED_AMOUNT,
    (select SUM(AMOUNT) from view_payment_transaction where BRANCH_NAME=view_praposal_master.BRANCH_NAME)AS MAPPED_AMOUNT FROM view_praposal_master WHERE 1 ${filter} group by BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN;`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getBranchwiseScrutinyFeeCollection information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}


exports.getLoanTypehWiseScrutinyFeeCollection = (req, res) => {
    var LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;

    var filter = '' + (LOAN_TYPE_ID ? ` AND LOAN_TYPE_ID=${LOAN_TYPE_ID}` : '');
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `select LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,
    (select SUM(AMOUNT) from view_payment_transaction where IS_PAYMENT_DONE=1 AND LOAN_TYPE_NAME=view_praposal_master.LOAN_TYPE_NAME)AS COLLECTED_AMOUNT,
    (select SUM(AMOUNT) from view_payment_transaction where LOAN_TYPE_NAME=view_praposal_master.LOAN_TYPE_NAME)AS MAPPED_AMOUNT FROM view_praposal_master WHERE 1 ${filter} group by LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN;`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getBranchwiseScrutinyFeeCollection information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

/* report 33,34
select BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN,
		(select SUM(AMOUNT) from view_payment_transaction where IS_PAYMENT_DONE=1 AND BRANCH_NAME=view_praposal_master.BRANCH_NAME)AS COLLECTED_AMOUNT,
		(select SUM(AMOUNT) from view_payment_transaction where BRANCH_NAME=view_praposal_master.BRANCH_NAME)AS MAPPED_AMOUNT FROM view_praposal_master WHERE 1 group by BRANCH_NAME,BRANCH_NAME_EN,BRANCH_NAME_KN
		
select LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN,
		(select SUM(AMOUNT) from view_payment_transaction where IS_PAYMENT_DONE=1 AND LOAN_TYPE_NAME=view_praposal_master.LOAN_TYPE_NAME)AS COLLECTED_AMOUNT,
		(select SUM(AMOUNT) from view_payment_transaction where LOAN_TYPE_NAME=view_praposal_master.LOAN_TYPE_NAME)AS MAPPED_AMOUNT FROM view_praposal_master WHERE 1 group by LOAN_TYPE_NAME,LOAN_TYPE_NAME_EN,LOAN_TYPE_NAME_KN			
*/

exports.getPrioritySectorStatus = (req, res) => {

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT NAME AS PRORITY_SECTOR_NAME,ifnull(a.COMPLETED_PRAPOSALS,0)AS COMPLETED_PRAPOSALS,ifnull(a.ONGOING_PRAPOSALS,0)AS ONGOING_PRAPOSALS,ifnull(a.COMPLETED_AMOUNT,0)AS COMPLETED_AMOUNT,ifnull(a.ONGOING_AMOUNT,0)AS ONGOING_AMOUNT,ifnull((a.COMPLETED_AMOUNT/priority_code_master.TARGET_AMOUNT)*100,0)AS COMPLETION_PERCENTAGE
    FROM priority_code_master LEFT JOIN (select
PRIORITY_CODE_ID,
(select COUNT(*) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE 		  CURRENT_STAGE_ID=13 ) AND PRIORITY_CODE_ID!=0 AND PRIORITY_CODE_ID=ld.PRIORITY_CODE_ID)AS COMPLETED_PRAPOSALS,
(select COUNT(*) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13) ) AND PRIORITY_CODE_ID!=0 AND PRIORITY_CODE_ID=ld.PRIORITY_CODE_ID)AS ONGOING_PRAPOSALS,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ) AND PRIORITY_CODE_ID!=0 AND PRIORITY_CODE_ID=ld.PRIORITY_CODE_ID)AS COMPLETED_AMOUNT,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13) ) AND PRIORITY_CODE_ID!=0 AND PRIORITY_CODE_ID=ld.PRIORITY_CODE_ID)AS ONGOING_AMOUNT
FROM view_loan_demand ld group by PRIORITY_CODE_ID ) a on (priority_code_master.ID = a.PRIORITY_CODE_ID);`;
    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getPrioritySectorStatus information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getWeakerSectorStatus = (req, res) => {

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT  NAME AS WEAKER_SECTOR_NAME,ifnull(a.COMPLETED_PRAPOSALS,0)AS COMPLETED_PRAPOSALS,ifnull(a.ONGOING_PRAPOSALS,0)AS ONGOING_PRAPOSALS,ifnull(a.COMPLETED_AMOUNT,0)AS COMPLETED_AMOUNT,ifnull(a.ONGOING_AMOUNT,0)AS ONGOING_AMOUNT,ifnull((a.COMPLETED_AMOUNT/weeker_section_code_master.TARGET_AMOUNT)*100,0)AS COMPLETION_PERCENTAGE
    FROM weeker_section_code_master LEFT JOIN (select
WEEKER_SECTION_ID,
(select COUNT(*) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE 		  CURRENT_STAGE_ID=13 ) AND WEEKER_SECTION_ID!=0 AND WEEKER_SECTION_ID=ld.WEEKER_SECTION_ID)AS COMPLETED_PRAPOSALS,
(select COUNT(*) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13) ) AND WEEKER_SECTION_ID!=0 AND WEEKER_SECTION_ID=ld.WEEKER_SECTION_ID)AS ONGOING_PRAPOSALS,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ) AND WEEKER_SECTION_ID!=0 AND WEEKER_SECTION_ID=ld.WEEKER_SECTION_ID)AS COMPLETED_AMOUNT,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13) ) AND WEEKER_SECTION_ID!=0 AND WEEKER_SECTION_ID=ld.WEEKER_SECTION_ID)AS ONGOING_AMOUNT
FROM view_loan_demand ld group by WEEKER_SECTION_ID ) a on (weeker_section_code_master.ID = a.WEEKER_SECTION_ID);
`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getWeakerSectorStatus information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getIndustrialMarkingStatus = (req, res) => {

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT  NAME AS INDUSTRIAL_NAME,ifnull(a.COMPLETED_PRAPOSALS,0)AS COMPLETED_PRAPOSALS,ifnull(a.ONGOING_PRAPOSALS,0)AS ONGOING_PRAPOSALS,ifnull(a.COMPLETED_AMOUNT,0)AS COMPLETED_AMOUNT,ifnull(a.ONGOING_AMOUNT,0)AS ONGOING_AMOUNT,ifnull((a.COMPLETED_AMOUNT/industry_code_master.TARGET_AMOUNT)*100,0)AS COMPLETION_PERCENTAGE
    FROM industry_code_master LEFT JOIN (select
INDUSTRY_CODE_ID,
(select COUNT(*) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE 		  CURRENT_STAGE_ID=13 ) AND INDUSTRY_CODE_ID!=0 AND INDUSTRY_CODE_ID=ld.INDUSTRY_CODE_ID)AS COMPLETED_PRAPOSALS,
(select COUNT(*) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13) ) AND INDUSTRY_CODE_ID!=0 AND INDUSTRY_CODE_ID=ld.INDUSTRY_CODE_ID)AS ONGOING_PRAPOSALS,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ) AND INDUSTRY_CODE_ID!=0 AND INDUSTRY_CODE_ID=ld.INDUSTRY_CODE_ID)AS COMPLETED_AMOUNT,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13) ) AND INDUSTRY_CODE_ID!=0 AND INDUSTRY_CODE_ID=ld.INDUSTRY_CODE_ID)AS ONGOING_AMOUNT
FROM view_loan_demand ld group by INDUSTRY_CODE_ID ) a on (industry_code_master.ID = a.INDUSTRY_CODE_ID);`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getIndustrialMarkingStatus information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getRealEstateMarkingStatus = (req, res) => {

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT  NAME AS REAL_ESTATE_NAME,ifnull(a.COMPLETED_PRAPOSALS,0)AS COMPLETED_PRAPOSALS,ifnull(a.ONGOING_PRAPOSALS,0)AS ONGOING_PRAPOSALS,ifnull(a.COMPLETED_AMOUNT,0)AS COMPLETED_AMOUNT,ifnull(a.ONGOING_AMOUNT,0)AS ONGOING_AMOUNT,ifnull((a.COMPLETED_AMOUNT/real_estate_marking_master.TARGET_AMOUNT)*100,0)AS COMPLETION_PERCENTAGE
    FROM real_estate_marking_master LEFT JOIN (select
REAL_ESTATE_MARKING,
(select COUNT(*) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ) AND REAL_ESTATE_MARKING!=0 AND REAL_ESTATE_MARKING=ld.REAL_ESTATE_MARKING)AS COMPLETED_PRAPOSALS,
(select COUNT(*) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13) ) AND REAL_ESTATE_MARKING!=0 AND REAL_ESTATE_MARKING=ld.REAL_ESTATE_MARKING)AS ONGOING_PRAPOSALS,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ) AND REAL_ESTATE_MARKING!=0 AND REAL_ESTATE_MARKING=ld.REAL_ESTATE_MARKING)AS COMPLETED_AMOUNT,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13) ) AND REAL_ESTATE_MARKING!=0 AND REAL_ESTATE_MARKING=ld.REAL_ESTATE_MARKING)AS ONGOING_AMOUNT
FROM view_loan_demand ld group by REAL_ESTATE_MARKING ) a on (real_estate_marking_master.ID = a.REAL_ESTATE_MARKING);`;

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getRealEstateMarkingStatus information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getPrioritySectorTargetCompletion = (req, res) => {
    
    let FROM_DATE = req.body.FROM_DATE;
    let TO_DATE = req.body.TO_DATE;

    var filter = '' + (FROM_DATE && TO_DATE ? ` AND CURRENT_STAGE_DATETIME between '${FROM_DATE}' and '${TO_DATE}' ` : '');

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT NAME AS PRORITY_SECTOR_NAME,TARGET_AMOUNT,ifnull(a.COMPLETED_AMOUNT,0)AS COMPLETED_AMOUNT,ifnull((a.COMPLETED_AMOUNT/priority_code_master.TARGET_AMOUNT)*100,0)AS COMPLETION_PERCENTAGE
    FROM priority_code_master LEFT JOIN (select
PRIORITY_CODE_ID,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ${filter}) AND PRIORITY_CODE_ID!=0 AND PRIORITY_CODE_ID=ld.PRIORITY_CODE_ID)AS COMPLETED_AMOUNT 
FROM view_loan_demand ld group by PRIORITY_CODE_ID ) a on (priority_code_master.ID = a.PRIORITY_CODE_ID)`;
    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getPrioritySectorTargetCompletion information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getWeakerSectorTargetCompletion = (req, res) => {
    
    let FROM_DATE = req.body.FROM_DATE;
    let TO_DATE = req.body.TO_DATE;

    var filter = '' + (FROM_DATE && TO_DATE ? ` AND CURRENT_STAGE_DATETIME between '${FROM_DATE}' and '${TO_DATE}' ` : '');

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT NAME AS WEAKER_SECTOR_NAME,TARGET_AMOUNT,ifnull(a.COMPLETED_AMOUNT,0)AS COMPLETED_AMOUNT,ifnull((a.COMPLETED_AMOUNT/weeker_section_code_master.TARGET_AMOUNT)*100,0)AS COMPLETION_PERCENTAGE
    FROM weeker_section_code_master LEFT JOIN (select
WEEKER_SECTION_ID,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ${filter}) AND WEEKER_SECTION_ID!=0 AND WEEKER_SECTION_ID=ld.WEEKER_SECTION_ID)AS COMPLETED_AMOUNT 
FROM view_loan_demand ld group by WEEKER_SECTION_ID ) a on (weeker_section_code_master.ID = a.WEEKER_SECTION_ID);`;
    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getWeakerSectorTargetCompletion information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getIndustrialMarkingTargetCompletion = (req, res) => {
    
    let FROM_DATE = req.body.FROM_DATE;
    let TO_DATE = req.body.TO_DATE;

    var filter = '' + (FROM_DATE && TO_DATE ? ` AND CURRENT_STAGE_DATETIME between '${FROM_DATE}' and '${TO_DATE}' ` : '');

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT NAME AS INDUSTIRAL_MARKING_NAME,TARGET_AMOUNT,ifnull(a.COMPLETED_AMOUNT,0)AS COMPLETED_AMOUNT,ifnull((a.COMPLETED_AMOUNT/industry_code_master.TARGET_AMOUNT)*100,0)AS COMPLETION_PERCENTAGE
    FROM industry_code_master LEFT JOIN (select
INDUSTRY_CODE_ID,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ${filter}) AND INDUSTRY_CODE_ID!=0 AND INDUSTRY_CODE_ID=ld.INDUSTRY_CODE_ID)AS COMPLETED_AMOUNT 
FROM view_loan_demand ld group by INDUSTRY_CODE_ID ) a on (industry_code_master.ID = a.INDUSTRY_CODE_ID);`;
    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getIndustrialMarkingTargetCompletion information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

exports.getRealEstateMarkingTargetCompletion = (req, res) => {
    
    let FROM_DATE = req.body.FROM_DATE;
    let TO_DATE = req.body.TO_DATE;

    var filter = '' + (FROM_DATE && TO_DATE ? ` AND CURRENT_STAGE_DATETIME between '${FROM_DATE}' and '${TO_DATE}' ` : '');

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT NAME AS REALESTATE_MARKING_NAME,TARGET_AMOUNT,ifnull(a.COMPLETED_AMOUNT,0)AS COMPLETED_AMOUNT,ifnull((a.COMPLETED_AMOUNT/real_estate_marking_master.TARGET_AMOUNT)*100,0)AS COMPLETION_PERCENTAGE
    FROM real_estate_marking_master LEFT JOIN (select
REAL_ESTATE_MARKING,
(select SUM(LOAN_AMOUNT) from view_loan_demand where PROPOSAL_ID IN (select ID from view_praposal_master WHERE CURRENT_STAGE_ID=13 ${filter}) AND REAL_ESTATE_MARKING!=0 AND REAL_ESTATE_MARKING=ld.REAL_ESTATE_MARKING)AS COMPLETED_AMOUNT 
FROM view_loan_demand ld group by REAL_ESTATE_MARKING ) a on (real_estate_marking_master.ID = a.REAL_ESTATE_MARKING);`;
    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getPrioritySectorTargetCompletion information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}

// report 21
exports.getLoanTypeInstallmentFrequencyWisePraposalCount = (req, res) => {
    
    let LOAN_TYPE_ID = req.body.LOAN_TYPE_ID;
    
    var filter = '' + (LOAN_TYPE_ID ? ` AND LOAN_TYPE_ID=${LOAN_TYPE_ID} ` : '');

    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey ;

    var query = `SELECT view_loan_scheme_master.ID,view_loan_scheme_master.NAME_MR,ifnull(a.FREQUENCY_1,0)AS FREQUENCY_1,ifnull(a.FREQUENCY_2,0)AS FREQUENCY_2,ifnull(a.FREQUENCY_3,0)AS FREQUENCY_3,ifnull(a.FREQUENCY_4,0)AS FREQUENCY_4,ifnull(a.FREQUENCY_5,0)AS FREQUENCY_5,ifnull(a.FREQUENCY_6,0)AS FREQUENCY_6,ifnull(a.FREQUENCY_7,0)AS FREQUENCY_7,ifnull(a.FREQUENCY_8,0)AS FREQUENCY_8,ifnull(a.FREQUENCY_9,0)AS FREQUENCY_9,ifnull(a.FREQUENCY_10,0)AS FREQUENCY_10
    FROM view_loan_scheme_master  LEFT JOIN (select LOAN_TYPE_ID,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=1 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID)  AS FREQUENCY_1,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=2 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_2,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=3 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_3,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=4 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_4,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=5 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_5,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=6 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_6,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=7 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_7,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=8 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_8,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=9 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_9,
                (select count(*) from loan_demand where INSTALLMENT_FREQUENCY_ID=10 AND LOAN_TYPE_ID=ld.LOAN_TYPE_ID) AS FREQUENCY_10			
                    FROM view_loan_demand ld WHERE 1 ${filter} GROUP BY LOAN_TYPE_ID) a on (view_loan_scheme_master.ID = a.LOAN_TYPE_ID) ;`;
    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                res.send({
                    "code": 400,
                    "message": "Failed to get getLoanTypeInstallmentFrequencyWisePraposalCount information ...",
                });
            }
            else {
                // console.log(results);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results
                });
            }
        });

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}