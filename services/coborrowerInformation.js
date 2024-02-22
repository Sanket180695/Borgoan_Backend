const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');

const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var coborrowerInformation = "coborrower_information";
var viewCoborrowerInformation = "view_" + coborrowerInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        NAME: req.body.NAME,
        MOBILE_NUMBER: req.body.MOBILE_NUMBER,

        CLIENT_ID: req.body.CLIENT_ID,
        VISIBILITY: req.body.VISIBILITY ? '1' : '0',
        APPLICANT_ID: req.body.APPLICANT_ID
    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt().optional(), body('NAME').optional(), body('MOBILE_NUMBER').optional(), body('ID').optional(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewCoborrowerInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get coborrowerInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewCoborrowerInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get coborrowerInformation information."
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
            mm.executeQueryData('INSERT INTO ' + coborrowerInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save coborrowerInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "CoborrowerInformation information saved successfully...",
                        'data': [{ ID: results.insertId }]
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
            mm.executeQueryData(`UPDATE ` + coborrowerInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update coborrowerInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "CoborrowerInformation information updated successfully...",
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

            db.executeDML(`DELETE FROM coborrower_information WHERE PROPOSAL_ID = ${PROPOSAL_ID}`, '', supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update coborrower Information ."
                    });

                }
                else {

                    var insertQuery = `Insert into coborrower_information(PROPOSAL_ID,NAME,MOBILE_NUMBER,CLIENT_ID) values ?`

                    var recordData = []

                    for (let i = 0; i < data.length; i++) {
                        const dataItem = data[i];

                        var rec = [PROPOSAL_ID, dataItem.NAME, dataItem.MOBILE_NUMBER, dataItem.CLIENT_ID]

                        recordData.push(rec);

                    }


                    db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                        if (error) {
                            console.log(error);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update coborrower Information ."
                            });
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "Coborrower Information updated successfully ."
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




exports.addCoborrower = (req, res) => {
    try {

        var data = reqData(req);
        //const errors = validationResult(req);
        var supportKey = req.headers['supportkey'];

        var connection = db.openConnection();

        mm.executeQuery(`select * from ` + viewCoborrowerInformation + ` where MOBILE_NUMBER = '${data.MOBILE_NUMBER}' and PROPOSAL_ID = ${data.PROPOSAL_ID}`, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get coborrower  Information information."
                });
            }
            else {

                if (results.length > 0) {
                    db.executeDML(`update ${coborrowerInformation} set NAME = ?,VISIBILITY = 1 where MOBILE_NUMBER = ? and PROPOSAL_ID = ? `, [data.NAME,data.MOBILE_NUMBER,data.PROPOSAL_ID], supportKey, connection, (error, resultsApplicantInsert) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save coborrower   information..."
                            });
                        }
                        else {
                            db.executeDML(`update personal_information set APPLICANT_NAME= ? where PROPOSAL_ID = ? and TYPE= ? and APPLICANT_ID= ? `, [data.NAME, data.PROPOSAL_ID, 'C', results[0].APPLICANT_ID], supportKey, connection, (error, resultsApplicantInsert) => {
                                if (error) {
                                    console.log(error);
                                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to save coborrower  information..."
                                    });
                                }
                                else {
                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "coborrower  information saved successfully...",
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    db.executeDML('call sp_create_guarentor_coborrower(?,?,?,?,?); ', [data.NAME, data.MOBILE_NUMBER, data.CLIENT_ID, data.PROPOSAL_ID, 'C'], supportKey, connection, (error, resultsApplicantInsert) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save coborrowerInformation..."
                            });
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "coborrowerInformation  saved successfully...",
                            });
            
                        }
                    });

                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}


exports.checkCoborrowerMobileNo = (req,res,next) =>{
    try {
 var proposalId = req.body.PROPOSAL_ID;
        var mobileNo = req.body.MOBILE_NUMBER;

        var supportKey = req.headers['supportkey'];


        db.executeDQL(`select IF(PRAPOSAL_TYPE = "वैयक्तिक",1,0) as data from praposal_master WHERE ID = ${proposalId}`,'', supportKey, (error, resultsCheck) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                // db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save guarantor information..."
                });
            }
            else {
                // for individual loan
                if (resultsCheck[0].data == 1) {

                    var query = `select (select IF(MOBILE_NO1 = '${mobileNo}' OR MOBILE_NO2 = '${mobileNo}',1,0) AS data from view_personal_information where PROPOSAL_ID  = ${proposalId} and TYPE = 'B') as personalCheck,IFNULL((SELECT SUM(if(MOBILE_NUMBER = '9022123436',1,0)) AS data FROM guarantor_information where PROPOSAL_ID = ${proposalId} and VISIBILITY = 1),0) as guarentorCheck,IFNULL((SELECT SUM(if(MOBILE_NUMBER = '9022123436',1,0)) AS data FROM coborrower_information where PROPOSAL_ID = ${proposalId} and VISIBILITY = 1),0) as coborrowerCheck `
                    db.executeDQL(query,'', supportKey, (error, resultsCheck1) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            // db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save guarantor  information..."
                            });
                        }
                        else {
				
                            if (resultsCheck1[0].personalCheck == 0 && resultsCheck1[0].guarentorCheck == 0 && resultsCheck1[0].coborrowerCheck == 0) {
                                next();
                            }
                            else if (resultsCheck1[0].personalCheck) {
                                res.send({
                                    "code": 350,
                                    "message": "सह-कर्जदाराचे मोबाइल क्रमांक हे अर्जदाराच्या मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsCheck1[0].guarentorCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "सह-कर्जदाराचे मोबाइल क्रमांक हे जामीनदाराच्या मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsCheck1[0].coborrowerCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "सह-कर्जदाराचे मोबाइल क्रमांक आधीपासून उपस्थित आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा ",
                                });
                            }                            
                            else {
                                res.send({
                                    "code": 350,
                                    "message": "कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }   
                        }
                    })

                }
                else {

                    db.executeDQL(`SELECT (select if(LANDLINE_NUMBER = '${mobileNo}',1,0) from firm_information where PROPOSAL_ID = ${proposalId}
                    ) AS firmCheck ,IFNULL((SELECT SUM(if(MOBILE_NUMBER = '${mobileNo}',1,0)) AS data FROM guarantor_information where PROPOSAL_ID =  ${proposalId} and VISIBILITY = 1
                    ),0) as guarentorCheck,IFNULL((SELECT SUM(if(MOBILE_NUMBER = '${mobileNo}',1,0)) AS data FROM coborrower_information where PROPOSAL_ID =  ${proposalId} and VISIBILITY = 1),0) as coborrowerCheck,IFNULL((SELECT SUM(if(MOBILE_NUMBER = '${mobileNo}',1,0)) AS data FROM partners_information where FIRM_INFORMATION_ID =  (SELECT ID FROM firm_information where PROPOSAL_ID = ${proposalId}) ),0) as pertenerCheck`,'', supportKey, (error, resultsApplicantcheck) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            // db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save guarantor  information..."
                            });
                        }
                        else {
                            // db.commitConnection(connection);



                            if (resultsApplicantcheck[0].firmCheck == 0 && resultsApplicantcheck[0].guarentorCheck == 0 && resultsApplicantcheck[0].coborrowerCheck == 0 && resultsApplicantcheck[0].pertenerCheck == 0) {
                                next();
                            }
                            else if (resultsApplicantcheck[0].firmCheck) {
                                res.send({
                                    "code": 350,
                                    "message": "सह-कर्जदाराचे मोबाइल क्रमांक हे संस्थेच्या मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsApplicantcheck[0].guarentorCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "सह-कर्जदाराचे मोबाइल क्रमांक हे जामीनदाराच्या मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsApplicantcheck[0].coborrowerCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "सह-कर्जदाराचे मोबाइल क्रमांक आधीपासून उपस्थित आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा ",
                                });
                            }
                            else if (resultsApplicantcheck[0].pertenerCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "सह-कर्जदाराचे मोबाइल क्रमांक हे संचालका/भागीदार/ट्रस्टी च्या मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });

                            }
                            else {
                                res.send({
                                    "code": 350,
                                    "message": "कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                        }
                    });
                }
            }
        })

    } catch (error) {
        console.log(error);
    }
}


exports.addCoborrower1 = (req, res) => {
    try {

        var data = reqData(req);
        //const errors = validationResult(req);
        var supportKey = req.headers['supportkey'];

        var connection = db.openConnection();

        db.executeDML('call sp_create_guarentor_coborrower(?,?,?,?,?); ', [data.NAME, data.MOBILE_NUMBER, data.CLIENT_ID, data.PROPOSAL_ID, 'C'], supportKey, connection, (error, resultsApplicantInsert) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save coborrowerInformation..."
                });
            }
            else {
                db.commitConnection(connection);
                res.send({
                    "code": 200,
                    "message": "coborrowerInformation  saved successfully...",
                });

            }
        });



    } catch (error) {
        console.log(error);
    }
}
