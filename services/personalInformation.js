const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var personalInformation = "personal_information";
var viewPersonalInformation = "view_" + personalInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        APPLICANT_NAME: req.body.APPLICANT_NAME,
        DOB: req.body.DOB,
        CAST: req.body.CAST,
        PAN: req.body.PAN,
        AADHAR: req.body.AADHAR,
        RELIGION: req.body.RELIGION,
        EDUCATION: req.body.EDUCATION,
        AGE: req.body.AGE,
        MEMBERSHIP_NUMBER: req.body.MEMBERSHIP_NUMBER,
        NET_WORTH_AS_ON: req.body.NET_WORTH_AS_ON,
        NET_WORTH_AMOUNT: req.body.NET_WORTH_AMOUNT ? req.body.NET_WORTH_AMOUNT : 0,
        PERMANENT_ADDRESS_ID: req.body.PERMANENT_ADDRESS_ID,
        CURRENT_ADDRESS_ID: req.body.CURRENT_ADDRESS_ID,
        MOBILE_NO1: req.body.MOBILE_NO1,
        MOBILE_NO2: req.body.MOBILE_NO2,
        LANDLINE_NO: req.body.LANDLINE_NO,
        EMAIL_ID: req.body.EMAIL_ID,
        MEMBERS_IN_FAMILY: req.body.MEMBERS_IN_FAMILY,
        IS_CO_APPLICANT: req.body.IS_CO_APPLICANT ? '1' : '0',

        CLIENT_ID: req.body.CLIENT_ID,
        GENDER: req.body.GENDER,
        IS_SUB_CLIENT: req.body.IS_SUB_CLIENT ? '1' : '0',
        SUB_BRANCH_ID: req.body.SUB_BRANCH_ID,
        TYPE: req.body.TYPE ? req.body.TYPE : '',
        APPLICANT_ID: req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0,
	DATE_OF_MEMBERSHIP: req.body.DATE_OF_MEMBERSHIP,
        MEMBERSHIP_AMOUNT: req.body.MEMBERSHIP_AMOUNT,
        AUDULT_COUNT: req.body.AUDULT_COUNT,
        CHILDREN_COUNT: req.body.CHILDREN_COUNT,
 	OCCUPATION: req.body.OCCUPATION,
        YEAR: req.body.YEAR,
	RELATION_WITH_APPICANT:req.body.RELATION_WITH_APPICANT,
	RECOMENDATION:req.body.RECOMENDATION,
	MOVALE_PROPERTY_VALUE:req.body.MOVALE_PROPERTY_VALUE,
IMMOVALE_PROPERTY_VALUE:req.body.IMMOVALE_PROPERTY_VALUE,
G_ANNUAL_INCOME:req.body.G_ANNUAL_INCOME,
G_PERSONAL_LOAN:req.body.G_PERSONAL_LOAN,
LIABILITY_AS_SURETY:req.body.LIABILITY_AS_SURETY

	

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt().optional(), body('APPLICANT_NAME').optional(), body('DOB').optional(), body('CAST').optional(), body('PAN').optional(), body('AADHAR').optional(), body('RELIGION').optional(), body('EDUCATION').optional(), body('AGE').isInt().optional(), body('MEMBERSHIP_NUMBER').optional(), body('NET_WORTH_AS_ON').optional(), body('NET_WORTH_AMOUNT').isDecimal().optional(), body('PERMANENT_ADDRESS_ID').isInt().optional(), body('CURRENT_ADDRESS_ID').isInt().optional(), body('MOBILE_NO1').optional(), body('MOBILE_NO2').optional(), body('LANDLINE_NO').optional(), body('EMAIL_ID').optional(), body('MEMBERS_IN_FAMILY').isInt().optional(), body('ID').optional(),


    ]
}



exports.getPersonalInfo = (req, res) => {

    try {
        var praposalId = req.body.PRAPOSAL_ID;
        var supportKey = req.headers['supportkey'];
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0;

        if (praposalId) {

            mm.executeQuery(`select * from ` + viewPersonalInformation + ` where PROPOSAL_ID = ${praposalId} AND TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``), supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to get personalInformation information."
                    });
                }
                else {

                    if (results.length > 0) {

                        mm.executeQuery(`select * from view_address_information where ID = ${results[0].CURRENT_ADDRESS_ID}`, supportKey, (error, resultsCurrent) => {
                            if (error) {
                                console.log(error);
                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to get personalInformation information."
                                });
                            }
                            else {

                                mm.executeQuery(`select * from view_address_information where ID = ${results[0].PERMANENT_ADDRESS_ID}`, supportKey, (error, resultsPer) => {
                                    if (error) {
                                        console.log(error);
                                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to get personalInformation information."
                                        });
                                    }
                                    else {

                                        mm.executeQuery(`select * from view_family_details where PERSONAL_INFORMATION_ID = ${results[0].ID} AND ARCHIVE_FLAG='F'`, supportKey, (error, resultsFamily) => {
                                            if (error) {
                                                console.log(error);
                                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                res.send({
                                                    "code": 400,
                                                    "message": "Failed to get personalInformation information."
                                                });
                                            }
                                            else {
                                                results[0].CURRENT_ADDRESS = resultsCurrent ? resultsCurrent : [];
                                                results[0].PERMANENT_ADDRESS = resultsPer ? resultsPer : [];
                                                results[0].FAMILY_MEMBERS = resultsFamily ? resultsFamily : [];

                                                res.send({
                                                    "code": 200,
                                                    "message": "success",

                                                    "data": results
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
                            "message": "No data found",

                        });
                    }
                }
            });

        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing - praposalId",

            });
        }

    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        console.log(error);
    }

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
        mm.executeQuery('select count(*) as cnt from ' + viewPersonalInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get personalInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewPersonalInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get personalInformation information."
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
            mm.executeQueryData('INSERT INTO ' + personalInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save personalInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "PersonalInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + personalInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update personal information."
                    });
                }
                else {
                    console.log(results);

                    mm.executeQuery(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 1 AND TYPE = '${data.TYPE}' ` + (data.TYPE != 'B' ? `AND APPLICANT_ID = ${data.APPLICANT_ID}` : ``), supportKey, (error, resultsUpdate) => {
                        if (error) {
                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to update personal Information ."
                            });
                        }
                        else {

                            res.send({
                                "code": 200,
                                "message": "Personal Information updated successfully...",
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






var async = require('async')

exports.updatePersonalInfo1 = (req, res) => {
    try {

        var data = reqData(req);
        var PERMANENT_ADDRESS = req.body.CURRENT_ADDRESS;
        var CURRENT_ADDRESS = req.body.PERMANENT_ADDRESS;
        var FAMILY_MEMBERS = req.body.FAMILY_MEMBERS;
        console.log(req.body);

        var supportKey = req.headers['supportkey'];

        var connection = db.openConnection();

        if (data && PERMANENT_ADDRESS && FAMILY_MEMBERS) {

            //----compulsory update 

            db.executeDML(`update address_information set STATE = ?,DISTRICT= ?,TALUKA=?,VILLAGE=?,PINCODE=?,LANDMARK=?,BUILDING=?,HOUSE_NO=? where ID = ?`,
                [PERMANENT_ADDRESS[0].STATE, PERMANENT_ADDRESS[0].DISTRICT, PERMANENT_ADDRESS[0].TALUKA, PERMANENT_ADDRESS[0].VILLAGE, PERMANENT_ADDRESS[0].PINCODE, PERMANENT_ADDRESS[0].LANDMARK, PERMANENT_ADDRESS[0].BUILDING, PERMANENT_ADDRESS[0].HOUSE_NO, PERMANENT_ADDRESS[0].ID], supportKey, connection, (error, results) => {
                    if (error) {
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update address Information ."
                        });
                    }
                    else {

                        if (CURRENT_ADDRESS[0].ID) {
                            db.executeDML(`update address_information set STATE = ?,DISTRICT= ?,TALUKA=?,VILLAGE=?,PINCODE=?,LANDMARK=?,BUILDING=?,HOUSE_NO=? where ID = ?`,
                                [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].ID], supportKey, connection, (error, resultsaddressupdate) => {
                                    if (error) {
                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to update address Information ."
                                        });
                                    }
                                    else {
                                        //call function that update personal information
                                        //data.CURRENT_ADDRESS_ID = resultsInsert.insertId;
                                        console.log(resultsaddressupdate)
                                        updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);
                                    }
                                })
                        }
                        else {

                            db.executeDML(`INSERT address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values (?,?,?,?,?,?,?,?,?) `, [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].CLIENT_ID], supportKey, connection, (error, resultsInsert) => {
                                if (error) {

                                    console.log(error);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to insert address Information ."
                                    });

                                }
                                else {
                                    //call function that update personal information
                                    console.log(resultsInsert)
                                    data.PERMANENT_ADDRESS_ID = resultsInsert.insertId;

                                    updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);

                                }
                            });

                        }
                    }
                });
        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter missing - data , PERMANENT_ADDRESS , FAMILY_MEMBERS "
            });

        }

    } catch (error) {
        console.log(error)
    }
}

function updatePersonalData1(data, supportKey, connection, FAMILY_MEMBERS, req, res) {
    try {

        console.log(data, FAMILY_MEMBERS)

        var systemDate = mm.getSystemDate();
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

        db.executeDML(`UPDATE ` + personalInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to update personal Information ."
                });
            }
            else {

                async.eachSeries(FAMILY_MEMBERS, function iteratorOverElems(familyData, callback) {

                    if (familyData.ID) {
                        db.executeDML(`update family_details set PERSONAL_INFORMATION_ID= ?,NAME=?,RELATION=?,OCCUPATION=?,YEARLY_INCOME=?,ARCHIVE_FLAG=?  where ID = ?`, [familyData.PERSONAL_INFORMATION_ID, familyData.NAME, familyData.RELATION, familyData.OCCUPATION, familyData.YEARLY_INCOME, familyData.ARCHIVE_FLAG, familyData.ID], supportKey, connection, (error, resultsUpdate) => {
                            if (error) {
                                console.log(error);
                                callback(error);
                            }
                            else {
                                callback();
                            }
                        });

                    }
                    else {

                        db.executeDML(`INSERT INTO family_details(PERSONAL_INFORMATION_ID,NAME,RELATION,OCCUPATION,YEARLY_INCOME,CLIENT_ID,ARCHIVE_FLAG) VALUES (?,?,?,?,?,?,?)`, [familyData.PERSONAL_INFORMATION_ID, familyData.NAME, familyData.RELATION, familyData.OCCUPATION, familyData.YEARLY_INCOME, familyData.CLIENT_ID, familyData.ARCHIVE_FLAG], supportKey, connection, (error, resultsInsert) => {
                            if (error) {
                                console.log(error);
                                callback(error);
                            }
                            else {
                                callback()
                            }
                        });

                    }
                },
                    function subCb(error) {
                        if (error) {
                            //rollback
                            console.log(error);
                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update family details information..."
                            });
                        } else {
                            if (data.APPLICANT_NAME) {
                                db.executeDML(`UPDATE praposal_master set APPLICANT_NAME = ? where ID = ? `, [data.APPLICANT_NAME, data.PROPOSAL_ID], supportKey, connection, (error, resultsInsert) => {
                                    if (error) {

                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to insert address Information ."
                                        });

                                    }
                                    else {

                                        db.commitConnection(connection);
                                        res.send({
                                            "code": 200,
                                            "message": "Family details information updated successfully...",
                                        });

                                    }
                                });
                            }
                            else {

                                db.commitConnection(connection);
                                res.send({
                                    "code": 200,
                                    "message": "Family details information updated successfully...",
                                });
                            }
                        }
                    });
            }
        });

    } catch (error) {
        console.log(error);
    }

}


exports.updatePersonalInfo1 = (req, res) => {
    try {

        var data = reqData(req);
        var PERMANENT_ADDRESS = req.body.CURRENT_ADDRESS;
        var CURRENT_ADDRESS = req.body.PERMANENT_ADDRESS;
        var FAMILY_MEMBERS = req.body.FAMILY_MEMBERS;
        console.log(req.body);

        var supportKey = req.headers['supportkey'];

        var connection = db.openConnection();


        if (data && PERMANENT_ADDRESS && FAMILY_MEMBERS) {

            //----compulsory update 
            if (PERMANENT_ADDRESS[0].ID) {
                db.executeDML(`update address_information set STATE = ?,DISTRICT= ?,TALUKA=?,VILLAGE=?,PINCODE=?,LANDMARK=?,BUILDING=?,HOUSE_NO=? where ID = ?`,
                    [PERMANENT_ADDRESS[0].STATE, PERMANENT_ADDRESS[0].DISTRICT, PERMANENT_ADDRESS[0].TALUKA, PERMANENT_ADDRESS[0].VILLAGE, PERMANENT_ADDRESS[0].PINCODE, PERMANENT_ADDRESS[0].LANDMARK, PERMANENT_ADDRESS[0].BUILDING, PERMANENT_ADDRESS[0].HOUSE_NO, PERMANENT_ADDRESS[0].ID], supportKey, connection, (error, results) => {
                        if (error) {
                            console.log(error);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update address Information ."
                            });
                        }
                        else {

                            if (CURRENT_ADDRESS[0].ID) {
                                db.executeDML(`update address_information set STATE = ?,DISTRICT= ?,TALUKA=?,VILLAGE=?,PINCODE=?,LANDMARK=?,BUILDING=?,HOUSE_NO=? where ID = ?`,
                                    [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].ID], supportKey, connection, (error, resultsaddressupdate) => {
                                        if (error) {
                                            console.log(error);
                                            db.rollbackConnection(connection);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update address Information ."
                                            });
                                        }
                                        else {
                                            //call function that update personal information
                                            //data.CURRENT_ADDRESS_ID = resultsInsert.insertId;
                                            console.log(resultsaddressupdate)
                                            updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);
                                        }
                                    })
                            }
                            else {

                                db.executeDML(`INSERT address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values (?,?,?,?,?,?,?,?,?) `, [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].CLIENT_ID], supportKey, connection, (error, resultsInsert) => {
                                    if (error) {

                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to insert address Information ."
                                        });

                                    }
                                    else {
                                        //call function that update personal information
                                        console.log(resultsInsert)
                                        data.CURRENT_ADDRESS_ID = resultsInsert.insertId;

                                        updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);

                                    }
                                });

                            }
                        }
                    });
            }
            else {
                db.executeDML(`INSERT address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values (?,?,?,?,?,?,?,?,?) `, [PERMANENT_ADDRESS[0].STATE, PERMANENT_ADDRESS[0].DISTRICT, PERMANENT_ADDRESS[0].TALUKA, PERMANENT_ADDRESS[0].VILLAGE, PERMANENT_ADDRESS[0].PINCODE, PERMANENT_ADDRESS[0].LANDMARK, PERMANENT_ADDRESS[0].BUILDING, PERMANENT_ADDRESS[0].HOUSE_NO, PERMANENT_ADDRESS[0].CLIENT_ID], supportKey, connection, (error, resultsInsert) => {
                    if (error) {

                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to insert address Information ."
                        });

                    }
                    else {
                        //call function that update personal information
                        console.log(resultsInsert)
                        data.PERMANENT_ADDRESS_ID = resultsInsert.insertId;

                        if (CURRENT_ADDRESS[0].ID) {
                            db.executeDML(`update address_information set STATE = ?,DISTRICT= ?,TALUKA=?,VILLAGE=?,PINCODE=?,LANDMARK=?,BUILDING=?,HOUSE_NO=? where ID = ?`,
                                [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].ID], supportKey, connection, (error, resultsaddressupdate) => {
                                    if (error) {
                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to update address Information ."
                                        });
                                    }
                                    else {
                                        //call function that update personal information
                                        //data.CURRENT_ADDRESS_ID = resultsInsert.insertId;
                                        console.log(resultsaddressupdate)
                                        updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);
                                    }
                                })
                        }
                        else {

                            db.executeDML(`INSERT address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values (?,?,?,?,?,?,?,?,?) `, [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].CLIENT_ID], supportKey, connection, (error, resultsInsert) => {
                                if (error) {

                                    console.log(error);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to insert address Information ."
                                    });

                                }
                                else {
                                    //call function that update personal information
                                    console.log(resultsInsert)
                                    data.CURRENT_ADDRESS_ID = resultsInsert.insertId;

                                    updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);

                                }
                            });

                        }

                    }
                });
            }

        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter missing - data , PERMANENT_ADDRESS , FAMILY_MEMBERS "
            });

        }

    } catch (error) {
        console.log(error)
    }
}

function updatePersonalData1(data, supportKey, connection, FAMILY_MEMBERS, req, res) {
    try {

        console.log(data, FAMILY_MEMBERS)

        var systemDate = mm.getSystemDate();
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

        db.executeDML(`UPDATE ` + personalInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to update personal Information ."
                });
            }
            else {

                async.eachSeries(FAMILY_MEMBERS, function iteratorOverElems(familyData, callback) {

                    if (familyData.ID) {
                        db.executeDML(`update family_details set PERSONAL_INFORMATION_ID= ?,NAME=?,RELATION=?,OCCUPATION=?,YEARLY_INCOME=?,ARCHIVE_FLAG=?  where ID = ?`, [familyData.PERSONAL_INFORMATION_ID, familyData.NAME, familyData.RELATION, familyData.OCCUPATION, familyData.YEARLY_INCOME, familyData.ARCHIVE_FLAG, familyData.ID], supportKey, connection, (error, resultsUpdate) => {
                            if (error) {
                                console.log(error);
                                callback(error);
                            }
                            else {
                                callback();
                            }
                        });

                    }
                    else {

                        db.executeDML(`INSERT INTO family_details(PERSONAL_INFORMATION_ID,NAME,RELATION,OCCUPATION,YEARLY_INCOME,CLIENT_ID,ARCHIVE_FLAG) VALUES (?,?,?,?,?,?,?)`, [familyData.PERSONAL_INFORMATION_ID, familyData.NAME, familyData.RELATION, familyData.OCCUPATION, familyData.YEARLY_INCOME, familyData.CLIENT_ID, familyData.ARCHIVE_FLAG], supportKey, connection, (error, resultsInsert) => {
                            if (error) {
                                console.log(error);
                                callback(error);
                            }
                            else {
                                callback()
                            }
                        });

                    }
                },
                    function subCb(error) {
                        if (error) {
                            //rollback
                            console.log(error);
                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update family details information..."
                            });
                        } else {
                            if (data.APPLICANT_NAME) {
                                db.executeDML(`UPDATE praposal_master set APPLICANT_NAME = ? where ID = ? `, [data.APPLICANT_NAME, data.PROPOSAL_ID], supportKey, connection, (error, resultsInsert) => {
                                    if (error) {

                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to insert address Information ."
                                        });

                                    }
                                    else {

                                        db.commitConnection(connection);
                                        res.send({
                                            "code": 200,
                                            "message": "Family details information updated successfully...",
                                        });

                                    }
                                });
                            }
                            else {

                                db.commitConnection(connection);
                                res.send({
                                    "code": 200,
                                    "message": "Family details information updated successfully...",
                                });
                            }
                        }
                    });
            }
        });

    } catch (error) {
        console.log(error);
    }

}


exports.updatePersonalInfo = (req, res) => {
    try {

        var data = reqData(req);
        var PERMANENT_ADDRESS = req.body.PERMANENT_ADDRESS;
        var CURRENT_ADDRESS = req.body.CURRENT_ADDRESS;
        var FAMILY_MEMBERS = req.body.FAMILY_MEMBERS;
        console.log(req.body);

        var supportKey = req.headers['supportkey'];

        var connection = db.openConnection();


        if (data && PERMANENT_ADDRESS && FAMILY_MEMBERS) {

            //----compulsory update 
            if (PERMANENT_ADDRESS[0].ID) {
                db.executeDML(`update address_information set STATE = ?,DISTRICT= ?,TALUKA=?,VILLAGE=?,PINCODE=?,LANDMARK=?,BUILDING=?,HOUSE_NO=? where ID = ?`,
                    [PERMANENT_ADDRESS[0].STATE, PERMANENT_ADDRESS[0].DISTRICT, PERMANENT_ADDRESS[0].TALUKA, PERMANENT_ADDRESS[0].VILLAGE, PERMANENT_ADDRESS[0].PINCODE, PERMANENT_ADDRESS[0].LANDMARK, PERMANENT_ADDRESS[0].BUILDING, PERMANENT_ADDRESS[0].HOUSE_NO, PERMANENT_ADDRESS[0].ID], supportKey, connection, (error, results) => {
                        if (error) {
                            console.log(error);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update address Information ."
                            });
                        }
                        else {

                            if (CURRENT_ADDRESS[0].ID) {
                                db.executeDML(`update address_information set STATE = ?,DISTRICT= ?,TALUKA=?,VILLAGE=?,PINCODE=?,LANDMARK=?,BUILDING=?,HOUSE_NO=? where ID = ?`,
                                    [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].ID], supportKey, connection, (error, resultsaddressupdate) => {
                                        if (error) {
                                            console.log(error);
                                            db.rollbackConnection(connection);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update address Information ."
                                            });
                                        }
                                        else {
                                            //call function that update personal information
                                            //data.CURRENT_ADDRESS_ID = resultsInsert.insertId;
                                            console.log(resultsaddressupdate)
                                            updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);
                                        }
                                    })
                            }
                            else {

                                db.executeDML(`INSERT address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values (?,?,?,?,?,?,?,?,?) `, [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].CLIENT_ID], supportKey, connection, (error, resultsInsert) => {
                                    if (error) {

                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to insert address Information ."
                                        });

                                    }
                                    else {
                                        //call function that update personal information
                                        console.log(resultsInsert)
                                        data.CURRENT_ADDRESS_ID = resultsInsert.insertId;

                                        updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);

                                    }
                                });

                            }
                        }
                    });
            }
            else {
                db.executeDML(`INSERT address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values (?,?,?,?,?,?,?,?,?) `, [PERMANENT_ADDRESS[0].STATE, PERMANENT_ADDRESS[0].DISTRICT, PERMANENT_ADDRESS[0].TALUKA, PERMANENT_ADDRESS[0].VILLAGE, PERMANENT_ADDRESS[0].PINCODE, PERMANENT_ADDRESS[0].LANDMARK, PERMANENT_ADDRESS[0].BUILDING, PERMANENT_ADDRESS[0].HOUSE_NO, PERMANENT_ADDRESS[0].CLIENT_ID], supportKey, connection, (error, resultsInsert) => {
                    if (error) {

                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to insert address Information ."
                        });

                    }
                    else {
                        //call function that update personal information
                        console.log(resultsInsert)
                        data.PERMANENT_ADDRESS_ID = resultsInsert.insertId;
console.log("THIS: ",data)
                        if (CURRENT_ADDRESS[0].ID) {
                            db.executeDML(`update address_information set STATE = ?,DISTRICT= ?,TALUKA=?,VILLAGE=?,PINCODE=?,LANDMARK=?,BUILDING=?,HOUSE_NO=? where ID = ?`,
                                [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].ID], supportKey, connection, (error, resultsaddressupdate) => {
                                    if (error) {
                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to update address Information ."
                                        });
                                    }
                                    else {
                                        //call function that update personal information
                                        //data.CURRENT_ADDRESS_ID = resultsInsert.insertId;
                                        console.log(resultsaddressupdate)
                                        updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);
                                    }
                                })
                        }
                        else {

                            db.executeDML(`INSERT address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values (?,?,?,?,?,?,?,?,?) `, [CURRENT_ADDRESS[0].STATE, CURRENT_ADDRESS[0].DISTRICT, CURRENT_ADDRESS[0].TALUKA, CURRENT_ADDRESS[0].VILLAGE, CURRENT_ADDRESS[0].PINCODE, CURRENT_ADDRESS[0].LANDMARK, CURRENT_ADDRESS[0].BUILDING, CURRENT_ADDRESS[0].HOUSE_NO, CURRENT_ADDRESS[0].CLIENT_ID], supportKey, connection, (error, resultsInsert) => {
                                if (error) {

                                    console.log(error);
                                    db.rollbackConnection(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to insert address Information ."
                                    });

                                }
                                else {
                                    //call function that update personal information
                                    console.log(resultsInsert)
                                    data.CURRENT_ADDRESS_ID = resultsInsert.insertId;

                                    updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res);

                                }
                            });

                        }

                    }
                });
            }

        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter missing - data , PERMANENT_ADDRESS , FAMILY_MEMBERS "
            });

        }

    } catch (error) {
        console.log(error)
    }
}

function updatePersonalData1(data, supportKey, connection, FAMILY_MEMBERS, req, res) {
    try {

        console.log(data, FAMILY_MEMBERS)

        var systemDate = mm.getSystemDate();
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

        db.executeDML(`UPDATE ` + personalInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to update personal Information ."
                });
            }
            else {

                async.eachSeries(FAMILY_MEMBERS, function iteratorOverElems(familyData, callback) {

                    if (familyData.ID) {
                        db.executeDML(`update family_details set PERSONAL_INFORMATION_ID= ?,NAME=?,RELATION=?,OCCUPATION=?,YEARLY_INCOME=?,ARCHIVE_FLAG=?  where ID = ?`, [familyData.PERSONAL_INFORMATION_ID, familyData.NAME, familyData.RELATION, familyData.OCCUPATION, familyData.YEARLY_INCOME, familyData.ARCHIVE_FLAG, familyData.ID], supportKey, connection, (error, resultsUpdate) => {
                            if (error) {
                                console.log(error);
                                callback(error);
                            }
                            else {
                                callback();
                            }
                        });

                    }
                    else {

                        db.executeDML(`INSERT INTO family_details(PERSONAL_INFORMATION_ID,NAME,RELATION,OCCUPATION,YEARLY_INCOME,CLIENT_ID,ARCHIVE_FLAG) VALUES (?,?,?,?,?,?,?)`, [familyData.PERSONAL_INFORMATION_ID, familyData.NAME, familyData.RELATION, familyData.OCCUPATION, familyData.YEARLY_INCOME, familyData.CLIENT_ID, familyData.ARCHIVE_FLAG], supportKey, connection, (error, resultsInsert) => {
                            if (error) {
                                console.log(error);
                                callback(error);
                            }
                            else {
                                callback()
                            }
                        });

                    }
                },
                    function subCb(error) {
                        if (error) {
                            //rollback
                            console.log(error);
                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update family details information..."
                            });
                        } else {
                            if (data.APPLICANT_NAME) {
                                db.executeDML(`UPDATE praposal_master set APPLICANT_NAME = ? where ID = ? `, [data.APPLICANT_NAME, data.PROPOSAL_ID], supportKey, connection, (error, resultsInsert) => {
                                    if (error) {

                                        console.log(error);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to insert address Information ."
                                        });

                                    }
                                    else {

                                        db.commitConnection(connection);
                                        res.send({
                                            "code": 200,
                                            "message": "Family details information updated successfully...",
                                        });

                                    }
                                });
                            }
                            else {

                                db.commitConnection(connection);
                                res.send({
                                    "code": 200,
                                    "message": "Family details information updated successfully...",
                                });
                            }
                        }
                    });
            }
        });

    } catch (error) {
        console.log(error);
    }

}


function updatePersonalData(data, supportKey, connection, FAMILY_MEMBERS, req, res) {
    try {
        console.log("Check in update personal information",data)

        console.log(data, FAMILY_MEMBERS)

        var systemDate = mm.getSystemDate();
        var criteria = {
            ID: req.body.ID,
            PARENT_NAME:req.body.PARENT_NAME
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

        db.executeDML(`UPDATE ` + personalInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}',PARENT_NAME = '${criteria.PARENT_NAME}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to update personal Information ."
                });
            }
            else {
                if (FAMILY_MEMBERS.length > 0) {
                    async.eachSeries(FAMILY_MEMBERS, function iteratorOverElems(familyData, callback) {

                        if (familyData.ID) {
                            db.executeDML(`update family_details set PERSONAL_INFORMATION_ID= ?,NAME=?,RELATION=?,OCCUPATION=?,YEARLY_INCOME=?,ARCHIVE_FLAG=?  where ID = ?`, [familyData.PERSONAL_INFORMATION_ID, familyData.NAME, familyData.RELATION, familyData.OCCUPATION, familyData.YEARLY_INCOME, familyData.ARCHIVE_FLAG, familyData.ID], supportKey, connection, (error, resultsUpdate) => {
                                if (error) {
                                    console.log(error);
                                    callback(error);
                                }
                                else {
                                    callback();
                                }
                            });

                        }
                        else {

                            db.executeDML(`INSERT INTO family_details(PERSONAL_INFORMATION_ID,NAME,RELATION,OCCUPATION,YEARLY_INCOME,CLIENT_ID,ARCHIVE_FLAG) VALUES (?,?,?,?,?,?,?)`, [familyData.PERSONAL_INFORMATION_ID, familyData.NAME, familyData.RELATION, familyData.OCCUPATION, familyData.YEARLY_INCOME, familyData.CLIENT_ID, familyData.ARCHIVE_FLAG], supportKey, connection, (error, resultsInsert) => {
                                if (error) {
                                    console.log(error);
                                    callback(error);
                                }
                                else {
                                    callback()
                                }
                            });

                        }
                    },
                        function subCb(error) {
                            if (error) {
                                //rollback
                                console.log(error);
                                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                                db.rollbackConnection(connection);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to update family details information..."
                                });
                            } else {
                                if (data.APPLICANT_NAME) {
                                    db.executeDML(`UPDATE praposal_master set APPLICANT_NAME = ? where ID = ? `, [data.APPLICANT_NAME, data.PROPOSAL_ID], supportKey, connection, (error, resultsInsert) => {
                                        if (error) {

                                            console.log(error);
                                            db.rollbackConnection(connection);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to insert address Information ."
                                            });

                                        }
                                        else {

                                            db.commitConnection(connection);
                                            res.send({
                                                "code": 200,
                                                "message": "Family details information updated successfully...",
                                            });

                                        }
                                    });
                                }
                                else {

                                    db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Family details information updated successfully...",
                                    });
                                }
                            }
                        });
                }
                else {
                    if (data.APPLICANT_NAME) {
                        db.executeDML(`UPDATE praposal_master set APPLICANT_NAME = ? where ID = ? `, [data.APPLICANT_NAME, data.PROPOSAL_ID], supportKey, connection, (error, resultsInsert) => {
                            if (error) {

                                console.log(error);
                                db.rollbackConnection(connection);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to insert address Information ."
                                });

                            }
                            else {

                                db.commitConnection(connection);
                                res.send({
                                    "code": 200,
                                    "message": "Family details information updated successfully...",
                                });

                            }
                        });
                    }
                    else {

                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "Family details information updated successfully...",
                        });
                    }
                }

            }
        });

    } catch (error) {
        console.log(error);
    }

}