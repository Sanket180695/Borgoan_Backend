const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");
var async = require('async')

const applicationkey = process.env.APPLICATION_KEY;

var guarantorInformation = "guarantor_information";
var viewGuarantorInformation = "view_" + guarantorInformation;


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
        mm.executeQuery('select count(*) as cnt from ' + viewGuarantorInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get guarantorInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewGuarantorInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get guarantorInformation information."
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
            mm.executeQueryData('INSERT INTO ' + guarantorInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save guarantorInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "GuarantorInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + guarantorInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update guarantorInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "GuarantorInformation information updated successfully...",
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

            db.executeDML(`DELETE FROM guarantor_information WHERE PROPOSAL_ID = ${PROPOSAL_ID}`, '', supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update guarantor Information ."
                    });

                }
                else {

                    var insertQuery = `Insert into guarantor_information(PROPOSAL_ID,NAME,MOBILE_NUMBER,CLIENT_ID) values ?`

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
                                "message": "Failed to update guarantor Information ."
                            });
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "Guarantor Information updated successfully ."
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


exports.addGuarentor = (req, res) => {
    try {

        var data = reqData(req);
        //const errors = validationResult(req);
        var supportKey = req.headers['supportkey'];

        var connection = db.openConnection();

        mm.executeQuery(`select * from ` + viewGuarantorInformation + ` where MOBILE_NUMBER = '${data.MOBILE_NUMBER}' and PROPOSAL_ID = ${data.PROPOSAL_ID}`, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get guarantorInformation information."
                });
            }
            else {

                if (results.length > 0) {
                    db.executeDML(`update ${guarantorInformation} set NAME= ?,VISIBILITY = 1 where MOBILE_NUMBER = ? and PROPOSAL_ID = ?`, [data.NAME, data.MOBILE_NUMBER,data.PROPOSAL_ID], supportKey, connection, (error, resultsApplicantInsert) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save guarantor  information..."
                            });
                        }
                        else {
                            db.executeDML(`update personal_information set APPLICANT_NAME= ? where PROPOSAL_ID = ? and TYPE= ? and APPLICANT_ID= ? `, [data.NAME, data.PROPOSAL_ID, 'G', results[0].APPLICANT_ID], supportKey, connection, (error, resultsApplicantInsert) => {
                                if (error) {
                                    console.log(error);
                                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to save guarantor  information..."
                                    });
                                }
                                else {
                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "GuarantorInformation information saved successfully...",
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    db.executeDML('call sp_create_guarentor_coborrower(?,?,?,?,?); ', [data.NAME, data.MOBILE_NUMBER, data.CLIENT_ID, data.PROPOSAL_ID, 'G'], supportKey, connection, (error, resultsApplicantInsert) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save guarantor  information..."
                            });
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "GuarantorInformation information saved successfully...",
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




exports.checkGurentorMobileNo = (req, res, next) => {
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

                    var query = `select (select IF(MOBILE_NO1 = '${mobileNo}' OR MOBILE_NO2 = '${mobileNo}',1,0) AS data from view_personal_information where PROPOSAL_ID  = ${proposalId} and TYPE = 'B') as personalCheck,IFNULL((SELECT SUM(if(MOBILE_NUMBER = '${mobileNo}',1,0)) AS data FROM guarantor_information where PROPOSAL_ID = ${proposalId} and VISIBILITY = 1),0) as guarentorCheck,IFNULL((SELECT SUM(if(MOBILE_NUMBER = '${mobileNo}',1,0)) AS data FROM coborrower_information where PROPOSAL_ID = ${proposalId} and VISIBILITY = 1),0) as coborrowerCheck `
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
                                    "message": "जामीनदाराचे मोबाइल क्रमांक हे अर्जदाराच्या मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsCheck1[0].guarentorCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "जामीनदाराचे मोबाइल क्रमांक आधीपासून उपस्थित आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsCheck1[0].coborrowerCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "जामीनदाराचे मोबाइल क्रमांक हे सह कर्जदाराच्या  मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }                            
                            else {
                                res.send({
                                    "code": 350,
                                    "message": " कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
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
                                    "message": "जामीनदाराचे मोबाइल क्रमांक हे संस्थेच्या मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsApplicantcheck[0].guarentorCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "जामीनदाराचे मोबाइल क्रमांक आधीपासून उपस्थित आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsApplicantcheck[0].coborrowerCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "जामीनदाराचे मोबाइल क्रमांक हे सह कर्जदाराच्या  मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });
                            }
                            else if (resultsApplicantcheck[0].pertenerCheck > 0) {
                                res.send({
                                    "code": 350,
                                    "message": "जामीनदाराचे मोबाइल क्रमांक हे संचालका/भागीदार/ट्रस्टी च्या मोबाइल नंबर शी जुळत आहे. कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
                                });

                            }
                            else {
                                res.send({
                                    "code": 350,
                                    "message": " कृपया दुसरा मोबाइल क्रमांक प्रविष्ट करा",
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






exports.addGuarentor1 = (req, res) => {
    try {

        var data = reqData(req);
        //const errors = validationResult(req);
        var supportKey = req.headers['supportkey'];

        var connection = db.openConnection();



        db.executeDML('call sp_create_guarentor_coborrower(?,?,?,?,?); ', [data.NAME, data.MOBILE_NUMBER, data.CLIENT_ID, data.PROPOSAL_ID, 'G'], supportKey, connection, (error, resultsApplicantInsert) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save guarantor  information..."
                });
            }
            else {
                db.commitConnection(connection);
                res.send({
                    "code": 200,
                    "message": "GuarantorInformation information saved successfully...",
                });
            }
        });



    } catch (error) {
        console.log(error);
    }
}



exports.getAllGuarentorInformation = (req, res) => {
    try {

        var proposalId = req.body.PROPOSAL_ID;

        var supportKey = req.headers['supportkey'];


        var connection = db.openConnection();

        db.executeDML('select * from guarantor_information where PROPOSAL_ID = ? AND VISIBILITY = 1', [proposalId], supportKey, connection, (error, resultsGuarentor) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save guarantor  information..."
                });
            }
            else {
                console.log("resultsGuarentor ", resultsGuarentor);
                var recordData = []
                async.eachSeries(resultsGuarentor, function iteratorOverElems(gItem, callback) {
                    db.executeDML(`select * from view_personal_information where PROPOSAL_ID = ? AND TYPE = 'G' and APPLICANT_ID = ?`, [proposalId, gItem.APPLICANT_ID], supportKey, connection, (error, resultsGuarentor1) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            // db.rollbackConnection(connection);
                            // res.send({
                            //     "code": 400,
                            //     "message": "Failed to save guarantor  information..."
                            // });
                            callback(error);
                        }
                        else {

                            var rdata = gItem;
                            rdata.PERSONAL_INFORMATION = resultsGuarentor1;
                            var query = `SET SESSION group_concat_max_len = 4294967290;
                                        SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'PROPOSAL_ID',PROPOSAL_ID,'INCOME_SOURCE_ID',INCOME_SOURCE_ID,'OTHER_INCOME_SOURCE_ID',OTHER_INCOME_SOURCE_ID,'OTHER_INCOME_SOURCE_ID2',OTHER_INCOME_SOURCE_ID2,'IS_SAVED',IS_SAVED,'IS_HOLD_AGRICULTURE_LAND',IS_HOLD_AGRICULTURE_LAND,'CLIENT_ID',CLIENT_ID,
                                          'SALARIED_INFORMATION',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'INCOME_INFORMATION_ID',INCOME_INFORMATION_ID,'PLACE_OF_EMPLOYMENT',PLACE_OF_EMPLOYMENT,'ORGANISATION_NAME',ORGANISATION_NAME,'CONTACT_NO_OF_EMPLOYER',CONTACT_NO_OF_EMPLOYER,'POST_OF_EMPLOYMENT',POST_OF_EMPLOYMENT,'GROSS_SALARY',GROSS_SALARY,'TOTAL_DEDUCTION',TOTAL_DEDUCTION,'NET_SALARY',NET_SALARY,'CLIENT_ID',CLIENT_ID,'ADDRESS',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data5 FROM view_address_information where ID = i.PLACE_OF_EMPLOYMENT ),'[]'))),']'),'"[','['),']"',']') as data6 FROM view_salaried_information i where INCOME_INFORMATION_ID = m.ID),'[]')),					
                                          'BUSINESS_FIRM_INFORMATION',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('CAPITAL',CAPITAL,'TURNOVER_YEARLY',TURNOVER_YEARLY,'INCOME_YEARLY',INCOME_YEARLY,'ID',ID,'TYPE',TYPE,'INCOME_INFORMATION_ID',INCOME_INFORMATION_ID,'NATURE_OF_FIRM',NATURE_OF_FIRM,'ADDRESS_ID',ADDRESS_ID,'CLIENT_ID',CLIENT_ID,
                                                              'ADDRESS',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data4 FROM view_address_information where ID = l.ADDRESS_ID ),'[]')
                                                                                                                  
                                          )),']'),'"[','['),']"',']') as data3 FROM view_business_firm_information l where INCOME_INFORMATION_ID = m.ID),'[]')),							
                                          'AGRICULTURE_LAND_INFORMATION',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('CURRENT_AGRICULTURE_PRODUCT',CURRENT_AGRICULTURE_PRODUCT,'ANNUAL_INCOME_FROM_THIS_LAND',ANNUAL_INCOME_FROM_THIS_LAND)),']'),'"[','['),']"',']') as data1 FROM view_agriculture_land_information k where INCOME_INFORMATION_ID = m.ID),'[]'))
                                          )),']'),'"[','['),']"',']') as data FROM view_income_information m where PROPOSAL_ID =? AND TYPE = 'G' and APPLICANT_ID = ?`
                            db.executeDML(query, [proposalId, gItem.APPLICANT_ID], supportKey, connection, (error, resultsGuarentor13) => {
                                if (error) {
                                    console.log(error);
                                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                    // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    // db.rollbackConnection(connection);
                                    // res.send({
                                    //     "code": 400,
                                    //     "message": "Failed to save guarantor  information..."
                                    // });
                                    callback(error);
                                }
                                else {

				var json = resultsGuarentor13[1][0].data
                    		if (json)
                        		json = json.replace(/\\/g, '');
                                    rdata.INCOME_INFORMATION =JSON.parse(json)
                                    db.executeDML(`select * from financial_information where PROPOSAL_ID = ? AND TYPE = 'G' and APPLICANT_ID = ?`, [proposalId, gItem.APPLICANT_ID], supportKey, connection, (error, resultsGuarentor14) => {
                                        if (error) {
                                            console.log(error);
                                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                            // db.rollbackConnection(connection);
                                            // res.send({
                                            //     "code": 400,
                                            //     "message": "Failed to save guarantor  information..."
                                            // });
                                            callback(error);
                                        }
                                        else {

                                            rdata.FINANCIAL_INFORMATION = resultsGuarentor14
                                            db.executeDML(`select * from credit_information where PROPOSAL_ID = ? AND TYPE = 'G' and APPLICANT_ID = ?`, [proposalId, gItem.APPLICANT_ID], supportKey, connection, (error, resultsGuarentor15) => {
                                                if (error) {
                                                    console.log(error);
                                                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                                    // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                    // db.rollbackConnection(connection);
                                                    // res.send({
                                                    //     "code": 400,
                                                    //     "message": "Failed to save guarantor  information..."
                                                    // });
                                                    callback(error);
                                                }
                                                else {
                                                    rdata.CREDIT_INFORMATION = resultsGuarentor15

                                                    db.executeDML(`select * from view_property_information where PROPOSAL_ID = ? AND TYPE = 'G' and APPLICANT_ID = ?`, [proposalId, gItem.APPLICANT_ID], supportKey, connection, (error, resultsGuarentor16) => {
                                                        if (error) {
                                                            console.log(error);
                                                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                            // db.rollbackConnection(connection);
                                                            // res.send({
                                                            //     "code": 400,
                                                            //     "message": "Failed to save guarantor  information..."
                                                            // });
                                                            callback(error);
                                                        }
                                                        else {
														console.log("here :",resultsGuarentor16);
                                                            rdata.PROPERTY_INFORMATION = resultsGuarentor16;

                                                            recordData.push(rdata);

                                                            callback();

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


                }, function subCb(err) {
                    if (err) {
                        //rollback
                        console.log(err)
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to add information..."
                        });
                    } else {
                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "success",
                            "data": recordData

                        });
                    }
                });

            }
        });

    } catch (error) {
        console.log(error)
    }
}