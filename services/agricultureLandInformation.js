const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var agricultureLandInformation = "agriculture_land_information";
var viewAgricultureLandInformation = "view_" + agricultureLandInformation;


function reqData(req) {

    var data = {
        INCOME_INFORMATION_ID: req.body.INCOME_INFORMATION_ID,
        PERSON_NAME: req.body.PERSON_NAME,
        IS_NAME_APPEAR_IN_7_12: req.body.IS_NAME_APPEAR_IN_7_12 ? '1' : '0',
        TOTAL_AREA_OF_LAND: req.body.TOTAL_AREA_OF_LAND,
        TOTAL_AREA_IN_APPLICANT_NAME: req.body.TOTAL_AREA_IN_APPLICANT_NAME,
        PLACE_OF_AGRICULTURE_LAND: req.body.PLACE_OF_AGRICULTURE_LAND,
        DETAILED_ADDRESS_ID: req.body.DETAILED_ADDRESS_ID,
        TOTAL_AREA_OF_LAND_AS_PER_8A: req.body.TOTAL_AREA_OF_LAND_AS_PER_8A,
        TOTAL_AREA_IN_APPLICANT_NAME_AS_PER_8A: req.body.TOTAL_AREA_IN_APPLICANT_NAME_AS_PER_8A,
        TYPE_OF_AGRICULTURE_LAND: req.body.TYPE_OF_AGRICULTURE_LAND,
        CURRENT_AGRICULTURE_PRODUCT: req.body.CURRENT_AGRICULTURE_PRODUCT,

        CLIENT_ID: req.body.CLIENT_ID,
        ANNUAL_INCOME_FROM_THIS_LAND: req.body.ANNUAL_INCOME_FROM_THIS_LAND,
        PROPERTY_INFO_ID: req.body.PROPERTY_INFO_ID,
        AKAR_RS: req.body.AKAR_RS,
        REMARKS: req.body.REMARKS,
		SUGAR_CANE: req.body.SUGAR_CANE ? req.body.SUGAR_CANE : '0',
		MAIZE: req.body.MAIZE ? req.body.MAIZE : '0',
		TAMBACCO: req.body.TAMBACCO ? req.body.TAMBACCO : '0',
		GRAINS: req.body.GRAINS ? req.body.GRAINS : '0',
		OTHER: req.body.OTHER ? req.body.OTHER : '0',
		TOTAL: req.body.TOTAL ? req.body.TOTAL : '0'

    }
    return data;
}



exports.validate = function () {
    return [

        body('INCOME_INFORMATION_ID').isInt().optional(),
        body('PERSON_NAME').optional(),
        body('IS_NAME_APPEAR_IN_7_12').optional().toInt().isInt(),
        body('TOTAL_AREA_OF_LAND').optional(),
        body('TOTAL_AREA_IN_APPLICANT_NAME').optional(),
        body('PLACE_OF_AGRICULTURE_LAND').optional(),
        body('DETAILED_ADDRESS_ID').isInt().optional(),
        body('TOTAL_AREA_OF_LAND_AS_PER_8A').optional(),
        body('TOTAL_AREA_IN_APPLICANT_NAME_AS_PER_8A').optional(),
        body('TYPE_OF_AGRICULTURE_LAND').optional(),
        body('CURRENCT_AGRICULTURE_PRODUCT').optional(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewAgricultureLandInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get agricultureLandInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewAgricultureLandInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get agricultureLandInformation information."
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
    var TYPE = req.body.TYPE ? req.body.TYPE : '';
    var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0
    var supportKey = req.headers['supportkey'];
    var connection = db.openConnection()
    if (!errors.isEmpty()) {

        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    }
    else {
        try {

            // db.executeDML(`Insert into property_information(PROPOSAL_ID,INCOME_INFO_REF_ID,MOVABLE_TYPE,IS_MACHINERY_OR_OTHER,IS_AGRICULTURE_LAND_OR_OTHER,CLIENT_ID,OWNER_NAME,TOTAL_AREA,AREA_UNIT,ADDRESS_ID,TYPE,APPLICANT_ID) values ((SELECT PROPOSAL_ID FROM view_income_information where ID = ${data.INCOME_INFORMATION_ID}),${data.INCOME_INFORMATION_ID},'I','O','A',${data.CLIENT_ID},?,?,'A',${data.DETAILED_ADDRESS_ID},?,?)`, [data.PERSON_NAME, data.TOTAL_AREA_OF_LAND, TYPE, APPLICANT_ID], supportKey, connection, (error, resultsUpdate) => {
            //     if (error) {
            //         //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            //         console.log(error);
            //         db.rollbackConnection(connection);
            //         res.send({
            //             "code": 400,
            //             "message": "Failed to update Income Information."
            //         });
            //     }
            //     else {
                    // data.PROPERTY_INFO_ID = resultsUpdate.insertId;
                    db.executeDML('INSERT INTO ' + agricultureLandInformation + ' SET ?', data, supportKey, connection, (error, results) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save agricultureLandInformation information..."
                            });
                        }
                        else {
                            db.commitConnection(connection);
                            console.log(results);
                            res.send({
                                "code": 200,
                                "message": "AgricultureLandInformation information saved successfully...",
                                "data": [{ ID: results.insertId }]
                            });
                        }
                    });

                // }
            // });

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

    if (!errors.isEmpty()) {
        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    }
    else {
        try {
            db.executeDML(`UPDATE ` + agricultureLandInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update agricultureLandInformation information."
                    });
                }
                else {
                    console.log(results);

                    // if (data.PERSON_NAME && data.TOTAL_AREA_OF_LAND && data.PROPERTY_INFO_ID && data.DETAILED_ADDRESS_ID) {
                    //     db.executeDML(`UPDATE property_information  SET OWNER_NAME = ?,TOTAL_AREA= ?, ADDRESS_ID= ?,CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${data.PROPERTY_INFO_ID} `, [data.PERSON_NAME, data.TOTAL_AREA_OF_LAND, data.DETAILED_ADDRESS_ID], supportKey, connection, (error, results) => {
                    //         if (error) {
                    //             //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    //             //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    //             console.log(error);
                    //             db.rollbackConnection(connection);
                    //             res.send({
                    //                 "code": 400,
                    //                 "message": "Failed to update agricultureLandInformation information."
                    //             });
                    //         }
                    //         else {
                    //             console.log(results);
                    //             db.commitConnection(connection);
                    //             res.send({
                    //                 "code": 200,
                    //                 "message": "AgricultureLandInformation information updated successfully...",
                    //             });
                    //         }
                    //     });
                    // }
                    // else {
                    db.commitConnection(connection);
                    res.send({
                        "code": 200,
                        "message": "AgricultureLandInformation information updated successfully...",
                    });
                    // }

                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
        }
    }
}