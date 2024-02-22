const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var applicantDocuments = "applicant_documents";
var viewApplicantDocuments = "view_" + applicantDocuments;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        DOCUMENT_ID: req.body.DOCUMENT_ID,
        DOCUMENT_TITLE: req.body.DOCUMENT_TITLE,
        DOCUMENT_DESCRIPTION: req.body.DOCUMENT_DESCRIPTION,
        IS_UPLOADED: req.body.IS_UPLOADED,//? '1' : '0',
        UPLOADED_DATETIME: req.body.UPLOADED_DATETIME,
        DOCUMENT_KEY: req.body.DOCUMENT_KEY,
        IS_COMPLUSORY: req.body.IS_COMPLUSORY, //? '1' : (req.body.IS_COMPLUSORY?'0':''),
        IS_VERIFIED: req.body.IS_VERIFIED ? '1' : '0',
        IS_APPROVED: req.body.IS_APPROVED ? '1' : '0',
        REMARK: req.body.REMARK,
        USER_ID: req.body.USER_ID,
        CLIENT_ID: req.body.CLIENT_ID,
        TYPE: req.body.TYPE,
        APPLICANT_ID: req.body.APPLICANT_ID,
	VERIFICATION_DATETIME: req.body.IS_VERIFIED?mm.getSystemDate():null,
    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('DOCUMENT_ID').isInt(), body('DOCUMENT_TITLE', ' parameter missing').exists(), body('DOCUMENT_DESCRIPTION').optional(), body('DOCUMENT_KEY', ' parameter missing').exists(), body('REMARK', ' parameter missing').exists(),

        body('USER_ID').isInt(), body('ID').optional(),


    ]
}

exports.validateUpdate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('DOCUMENT_TITLE', ' parameter missing'), body('DOCUMENT_DESCRIPTION').optional(), body('DOCUMENT_KEY', ' parameter missing'),
        body('IS_VERIFIED').toInt().isInt(),
        body('IS_APPROVED').toInt().isInt(),
        body('REMARK', ' parameter missing'), body('ID').optional(),

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
    // let sortValue = req.body.sortValue ? req.body.sortValue : 'ASC';
    let sortValue = 'ASC';
    let filter = req.body.filter ? req.body.filter : '';

    let criteria = '';

    if (pageIndex === '' && pageSize === '')
        criteria = filter + " order by SEQ " + " " + sortValue;
    else
        criteria = filter + " order by SEQ " + " " + sortValue + " LIMIT " + start + "," + end;

    let countCriteria = filter;
    var supportKey = req.headers['supportkey'];
    try {
        mm.executeQuery('select count(*) as cnt from ' + viewApplicantDocuments + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get applicantDocuments count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewApplicantDocuments + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get applicantDocument information."
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
            mm.executeQueryData('INSERT INTO ' + applicantDocuments + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save applicantDocument information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ApplicantDocument information saved successfully...",
                         "data": [{
                            ID: results.insertId
                        }]
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
    console.log(req.body);
    var data = reqData(req);
    var supportKey = req.headers['supportkey'];
    var criteria = {
        ID: req.body.ID,
    };
    var systemDate = mm.getSystemDate();
    var setData = "";
    var recordData = [];
data.VERIFICATION_DATETIME = data.IS_VERIFIED=='1'?mm.getSystemDate():null
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
            mm.executeQueryData(`UPDATE ` + applicantDocuments + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update applicantDocument information."
                    });
                }
                else {
                    console.log(results);

                    res.send({
                        "code": 200,
                        "message": "ApplicantDocument information updated successfully...",
                    });
                    /*
                    
                    mm.executeQueryData(`UPDATE ` + applicantDocuments + ` SET IS_VERIFIED = 0,IS_APPROVED= 0,  CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, '', supportKey, (error, results) => {
                                    if (error) {
                                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                        console.log(error);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to update applicantDocument information."
                                        });
                                    }
                                    else {
                                        console.log(results);
                                        
                                    }
                                });*/

                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
        }
    }
}







var async = require('async')

exports.addBulk = (req, res) => {
    try {
        var data = req.body.DATA;
        var supportKey = req.headers['supportkey'];
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0

        if (data) {
            async.eachSeries(data, function iteratorOverElems(dataItem, callback) {

                mm.executeQuery(`select * from view_applicant_documents where PROPOSAL_ID = '${dataItem.PROPOSAL_ID}' AND DOCUMENT_TITLE = '${dataItem.DOCUMENT_TITLE}' and TYPE = '${TYPE}' ` + (TYPE != 'B' ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``), supportKey, (error, resultsDocument) => {
                    if (error) {
                        console.log(error);
                        callback(error);
                    }
                    else {
                        if (resultsDocument.length > 0) {

                            //Update

                            mm.executeQueryData(`UPDATE applicant_documents set DOCUMENT_TITLE = ?,DOCUMENT_DESCRIPTION = ?,IS_COMPLUSORY = ?,APPLICANT_ID = ?,TYPE = ? WHERE ID = ?`, [dataItem.DOCUMENT_TITLE, dataItem.DOCUMENT_DESCRIPTION, dataItem.IS_COMPLUSORY, APPLICANT_ID, TYPE, resultsDocument[0].ID], supportKey, (error, resultUpdate) => {
                                if (error) {
                                    console.log(error);
                                    callback(error);
                                }
                                else {
                                    console.log("success", resultUpdate);
                                    callback();
                                }
                            });
                        }
                        else {
                            //insert

                            mm.executeQueryData(`INSERT INTO applicant_documents(PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,DOCUMENT_DESCRIPTION,IS_COMPLUSORY,CLIENT_ID,TYPE,APPLICANT_ID) VALUES(${dataItem.PROPOSAL_ID},${dataItem.DOCUMENT_ID},'${dataItem.DOCUMENT_TITLE}','${dataItem.DOCUMENT_DESCRIPTION}',${dataItem.IS_COMPLUSORY},${dataItem.CLIENT_ID},'${TYPE}',${APPLICANT_ID})`, '', supportKey, (error, resultInsert) => {
                                if (error) {
                                    console.log(error);
                                    callback(error);
                                }
                                else {
                                    console.log("success", resultInsert);
                                    callback();
                                }
                            });
                        }
                    }
                })
            }, function subCb(err) {
                if (err) {
                    //rollback
                    //db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to add information..."
                    });
                } else {
                    //db.commitConnection(connection);
                    res.send({
                        "code": 200,
                        "message": "Applicant document information saved successfully...",
                    });
                }
            });

        } else {
            res.send({
                "code": 400,
                "message": "missing parameters - data",
            });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getDocuments = (req, res) => {
    try {
        var proposalId = req.body.PROPOSAL_ID;
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0
        var supportKey = req.headers['supportkey'];

        var key1 = 0, key2 = 0, key3 = 0;


        // if (TYPE == 'B') {
        key1 = 2;
        key2 = 3;
        // key3 = 4;
        // }
        // else if (TYPE == 'C') {
        //     key1 = 66;
        //     // key2 = 0;
        //     // key3 = 0;

        // }
        // else if (TYPE == 'G') {
        //     key1 = 55;
        //     key2 = 56;
        // }
        // else {
        //     key1 = 0; key2 = 0; key3 = 0;
        // }

        // console.log("here123", TYPE, key1, key2, key3)

        if (proposalId) {

            var query = `SET SESSION group_concat_max_len =4294967290;
            SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',p.ID, 'title',p.NAME,'title_en', p.NAME_EN,'title_kn', p.NAME_KN,'expanded','true','disabled','false','children',
             ifnull( ( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key', s.ID, 'title', s.NAME,'title_en', s.NAME_EN,'title_kn', s.NAME_KN,'checked',(
    select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + ` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID),'disabled',(
    select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + ` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID AND IS_UPLOADED = 1),'isLeaf','true'
           )),']'),'"[','['),']"',']') FROM view_document_master s where GROUP_ID = 2)
             ,'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master p WHERE ID = ${key1}`;
			 
			      //var query1 = `SELECT s.ID AS key,s.NAME AS title,s.NAME_EN AS title_en,s.NAME_KN AS title_kn,(
    //select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + ` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID) AS checked,(
    //select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + ` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID AND IS_UPLOADED = 1) AS  disabled  FROM view_document_master s where GROUP_ID = 2 `;


            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Document information."
                    });
                }
                else {
                    //console.log(results);
					
					  var query1 = `SET SESSION group_concat_max_len =4294967290;
            SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',p.ID, 'title',p.NAME,'title_en', p.NAME_EN,'title_kn', p.NAME_KN,'expanded','true','disabled','false','children',
             ifnull( ( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key', s.ID, 'title', s.NAME,'title_en', s.NAME_EN,'title_kn', s.NAME_KN,'checked',(
    select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + ` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID),'disabled',(
    select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + ` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID AND IS_UPLOADED = 1),'isLeaf','true'
           )),']'),'"[','['),']"',']') FROM view_document_master s where GROUP_ID = 3)
             ,'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master p WHERE ID = ${key2}`;

                   // var query1 = `SELECT s.ID AS key,s.NAME AS title,s.NAME_EN AS title_en,s.NAME_KN AS title_kn,(
    //select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + ` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID) AS checked,(
    //select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``) + ` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID AND IS_UPLOADED = 1) AS  disabled  FROM view_document_master s where GROUP_ID = 3 `;

                    mm.executeQuery(query1, supportKey, (error, resultsIncomeInfo) => {
                        if (error) {
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to get Document information."
                            });
                        }
                        else {
                            var json1 = results[1][0].data;
                            if (json1)
                                json1 = json1.replace(/\\/g, '').replace(/"true"/g, true).replace(/"false"/g, false);

                            console.log(json1);

                            var json2 = resultsIncomeInfo[1][0].data;
                            if (json2)
                                json2 = json2.replace(/\\/g, '').replace(/"true"/g, true).replace(/"false"/g, false);

                            console.log(json2);

                            // var json3 = resultsPurposeInfo[1][0].data;
                            // if (json3)
                            //     json3 = json3.replace(/\\/g, '').replace(/"true"/g, true).replace(/"false"/g, false);

                            // console.log(json3);

                            res.send({
                                "code": 200,
                                "message": "success",
                                "data": [{
                                    "KYC": json1 ? JSON.parse(json1) : [],
                                    "OTHER": json2 ? JSON.parse(json2) : [],
                                    // "PURPOSE": json3 ? JSON.parse(json3) : []
                                }]
                            });
                            
                        }

                    });

                }

            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing- proposal_Id",
            });
        }

    } catch (error) {
        console.log(error);
    }
}

exports.updateDocument = (req, res) => {
    try {

        var KYC = req.body.KYC;
        var OTHER = req.body.OTHER;
        // var PURPOSE = req.body.PURPOSE;
        var proposalId = req.body.PROPOSAL_ID;
        var userId = req.body.USER_ID;

        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0
        
        var supportKey = req.headers['supportkey'];

        if (KYC && OTHER ) {
            var connection = db.openConnection();

            var data = [];
              

            if (KYC.length > 0)
                for (let l = 0; l < KYC[0].children.length; l++) {
                    const kycData = KYC[0].children[l];

                    if (kycData.isLeaf && !kycData.disabled) {

                        data.push(kycData);
                    }

                }

            if (0)//change here
                for (let p = 0; p < OTHER[0].children.length; p++) {
                    const incomeData = OTHER[0].children[p];

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

            var documents = [];
            async.eachSeries(data, function iteratorOverElems(documentMappingData, callback) {

                mm.executeQuery(`select * from view_applicant_documents where PROPOSAL_ID = ${proposalId} and DOCUMENT_ID = ${documentMappingData.key} and TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``), supportKey, (error, results) => {
                    if (error) {
                        console.log(error)
                        callback(error);
                    }
                    else {
                        if (results.length > 0) {
                            // console.log(documentMappingData)
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
                                documents.push(documentMappingData.key);
                                db.executeDML(`insert into applicant_documents(PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,CLIENT_ID,TYPE,APPLICANT_ID) values (?,?,(select NAME from  document_master where ID = ?),1,?,?)`, [proposalId, documentMappingData.key, documentMappingData.key, TYPE, APPLICANT_ID], supportKey, connection, (error, resultsInsert) => {
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

                        var logAction = `Proposal has mapped additional documents.`;
                        var logDescription = `concat((select NAME from user_master where ID = ${userId}),' has mapped ',(select group_concat(NAME_EN) FROM document_master WHERE ID IN (${documents.toString()})),' documents to the proposal ',(SELECT LOAN_KEY FROM PROPOSAL_MASTER WHERE ID=${proposalId}))`;

                        addLogs(proposalId, logAction, logDescription, userId, 0, 0, 1)

                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "Document Information saved successfully...",
                        });

                    }
                });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing- KYC,OTHER",
            });

        }
    } catch (error) {
        console.log(error);
    }
}


exports.getDocuments_OLD = (req, res) => {
    try {
        var proposalId = req.body.PROPOSAL_ID;
	var TYPE = req.body.TYPE?req.body.TYPE:'';
        var APPLICANT_ID = req.body.APPLICANT_ID?req.body.APPLICANT_ID:0
        var supportKey = req.headers['supportkey'];

 var key1=0, key2=0, key3 = 0;


        if (TYPE == 'B') {
            key1 = 2;
            key2 = 3;
            key3 = 4;
        }
        else if (TYPE == 'C') {
            key1 = 66;
            // key2 = 0;
           // key3 = 0;

        }
        else if (TYPE == 'G') {
            key1 = 55;
            key2 = 56;
        }
        else
        {
            key1=0; key2=0; key3 = 0;
        }

console.log("here123",TYPE,key1, key2, key3)

        if (proposalId) {

            var query = `SET SESSION group_concat_max_len =4294967290;
            SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',p.ID, 'title',p.NAME,'expanded','true','disabled','false','children',
             ifnull( ( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key', s.ID, 'title', s.NAME,'checked',(
    select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``)+` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID),'disabled',(
    select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``)+` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID AND IS_UPLOADED = 1),'isLeaf','true'
           )),']'),'"[','['),']"',']') FROM view_document_master s where GROUP_ID = 2)
             ,'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master p WHERE ID = ${key1}`;

            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Document information."
                    });
                }
                else {
                    //console.log(results);

                    var query1 = `SET SESSION group_concat_max_len =4294967290;
                    SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',p.ID, 'title',p.NAME,'expanded','true','disabled','false','children',
                     ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',d.ID, 'title',d.NAME,'expanded','true','disabled','false','children',
                     ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',g.ID, 'title',g.NAME,'expanded','true','disabled','false','children',
                     ifnull(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key', s.ID, 'title', s.NAME,'checked',(
    select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``)+` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID),'disabled',(
            select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID = ${proposalId} `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``)+` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID AND IS_UPLOADED = 1),'isLeaf','true'
                   )),']'),'"[','['),']"',']') FROM view_document_master s where GROUP_ID = g.ID)
                     ,'[]'))),']'),'"[','['),']"',']') as data2 FROM view_document_group_master g WHERE PARENT_ID = d.ID  )
                     ,'[]'))),']'),'"[','['),']"',']') as data1 FROM view_document_group_master d WHERE PARENT_ID = p.ID )
                     ,'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master p WHERE ID = ${key2} `;

                    mm.executeQuery(query1, supportKey, (error, resultsIncomeInfo) => {
                        if (error) {
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to get Document information."
                            });
                        }
                        else {

                            var query2 = `SET SESSION group_concat_max_len =4294967290;
                                SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',p.ID, 'title',p.NAME,'expanded','true','disabled','false','checked','false','children',
                                 ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',d.ID, 'title',d.NAME,'expanded','true','disabled','false','checked','false','children',
                                 ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',g.ID, 'title',g.NAME,'expanded','true','disabled','false','checked','false','children',
                                 ifnull(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key', s.ID, 'title', s.NAME,'checked',(
        select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``)+` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID),'disabled',(select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``)+` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s.ID AND IS_UPLOADED = 1),'isLeaf','true'
                               )),']'),'"[','['),']"',']') FROM view_document_master s where GROUP_ID = g.ID)
                                 ,'[]'))),']'),'"[','['),']"',']') as data1 FROM view_document_group_master g WHERE PARENT_ID = d.ID  )
                                 ,IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key', s1.ID, 'title', s1.NAME,'checked',(
        select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID =${proposalId} `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``)+` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s1.ID),'disabled',(select if(count(*) > 0,'true','false') from applicant_documents where PROPOSAL_ID = ${proposalId} `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``)+` AND TYPE = '${TYPE}' AND DOCUMENT_ID = s1.ID AND IS_UPLOADED = 1),'isLeaf','true'
                               )),']'),'"[','['),']"',']') FROM view_document_master s1 where GROUP_ID = d.ID),'[]')))),']'),'"[','['),']"',']') as data1 FROM view_document_group_master d WHERE PARENT_ID = p.ID )
                                 ,'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master p WHERE ID = ${key3}                               `
                                

                            mm.executeQuery(query2, supportKey, (error, resultsPurposeInfo) => {
                                if (error) {
                                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    console.log(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Document information."
                                    });
                                }
                                else {

                                    var json1 = results[1][0].data;
                                    if (json1)
                                        json1 = json1.replace(/\\/g, '').replace(/"true"/g,true).replace(/"false"/g,false);
                                      
                                    console.log(json1);

                                    var json2 = resultsIncomeInfo[1][0].data;
                                    if (json2)
                                        json2 = json2.replace(/\\/g, '').replace(/"true"/g,true).replace(/"false"/g,false);
                                     
console.log(json2);

                                    var json3 = resultsPurposeInfo[1][0].data;
                                    if (json3)
                                        json3 = json3.replace(/\\/g, '').replace(/"true"/g,true).replace(/"false"/g,false);
                                    
console.log(json3);


                                    res.send({
                                        "code": 200,
                                        "message": "success",
                                        "data": [{
                                            "KYC": json1?JSON.parse(json1):[],
                                            "INCOME": json2?JSON.parse(json2):[],
                                            "PURPOSE": json3?JSON.parse(json3):[]
                                        }]
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
                "message": "Parameter missing- proposal_Id",
            });
        }

    } catch (error) {
        console.log(error);
    }
}



exports.updateDocument_OLD = (req, res) => {
    try {

        var KYC = req.body.KYC;
        var INCOME = req.body.INCOME;
        var PURPOSE = req.body.PURPOSE;
        var proposalId = req.body.PROPOSAL_ID;
        var userId = req.body.USER_ID;
        var TYPE = req.body.TYPE?req.body.TYPE:'';
        var APPLICANT_ID = req.body.APPLICANT_ID?req.body.APPLICANT_ID:0

        var supportKey = req.headers['supportkey'];

        if (KYC && INCOME && PURPOSE ) {
            var connection = db.openConnection();

            var data = [];
if(PURPOSE.length > 0)
           for (let i = 0; i < PURPOSE[0].children.length; i++) {
                const purposeData = PURPOSE[0].children[i];

                for (let j = 0; j < purposeData.children.length; j++) {
                    const loantypeData = purposeData.children[j];
 		
                    if (loantypeData.isLeaf && !loantypeData.disabled) {

                        data.push(loantypeData);
                    }
                    else{
                        for (let k = 0; k < loantypeData.children.length; k++) {
                            const documentData = loantypeData.children[k];

                            if (documentData.isLeaf && !documentData.disabled) {
                                data.push(documentData);
                            }

                        }
                    }
                }

            }



  if(KYC.length > 0)
            for (let l = 0; l < KYC[0].children.length; l++) {
                const kycData = KYC[0].children[l];

                if (kycData.isLeaf && !kycData.disabled) {

                    data.push(kycData);
                }

            }

if(INCOME.length > 0)
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

		   var documents =[];
            async.eachSeries(data, function iteratorOverElems(documentMappingData, callback) {


                mm.executeQuery(`select * from view_applicant_documents where PROPOSAL_ID = ${proposalId} and DOCUMENT_ID = ${documentMappingData.key} and TYPE = '${TYPE}' `+(APPLICANT_ID?`AND APPLICANT_ID = ${APPLICANT_ID}`:``), supportKey, (error, results) => {
                    if (error) {
                        console.log(error)
                        callback(error);
                    }
                    else {
                        if (results.length > 0) {
				console.log(documentMappingData)
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
 documents.push(documentMappingData.key);
                                db.executeDML(`insert into applicant_documents(PROPOSAL_ID,DOCUMENT_ID,DOCUMENT_TITLE,CLIENT_ID,TYPE,APPLICANT_ID) values (?,?,(select NAME from  document_master where ID = ?),1,?,?)`, [proposalId, documentMappingData.key, documentMappingData.key,TYPE,APPLICANT_ID], supportKey, connection, (error, resultsInsert) => {
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
			   var  logAction =`Proposal has mapped additional documents.`;
                       var logDescription = `concat((select NAME from user_master where ID = ${userId}),' has mapped ',(select group_concat(NAME_EN) FROM document_master WHERE ID IN (${documents.toString()})),' documents to the proposal ',(SELECT LOAN_KEY FROM PROPOSAL_MASTER WHERE ID=${proposalId}))`;
                  
                        addLogs(proposalId,logAction,logDescription,userId,0,0,1,supportKey)

                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "Document Information saved successfully...",
                        });

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
