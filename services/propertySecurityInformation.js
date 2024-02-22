const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var propertySecurityInformation = "property_security_information";
var viewPropertySecurityInformation = "view_" + propertySecurityInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        PROPERTY_INFORMATION_ID: req.body.PROPERTY_INFORMATION_ID,
        VALUATOR_NAME: req.body.VALUATOR_NAME,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT ? req.body.VALUATION_AMOUNT : 0,
        VALUATION_DATE: req.body.VALUATION_DATE,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt().optional(), body('PROPERTY_INFORMATION_ID').isInt(), body('VALUATOR_NAME').optional(), body('VALUATION_AMOUNT').isDecimal().optional(), body('VALUATION_DATE').optional(), body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewPropertySecurityInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get propertySecurityInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewPropertySecurityInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get propertySecurityInformation information."
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
            mm.executeQueryData('INSERT INTO ' + propertySecurityInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save propertySecurityInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "PropertySecurityInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + propertySecurityInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update propertySecurityInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "PropertySecurityInformation information updated successfully...",
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

            db.executeDML(`DELETE FROM property_security_information WHERE PROPOSAL_ID = ${PROPOSAL_ID}`, '', supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update property Security Information ."
                    });

                }
                else {

                    var insertQuery = `Insert into property_security_information(PROPOSAL_ID,PROPERTY_INFORMATION_ID,VALUATOR_NAME,VALUATION_AMOUNT,VALUATION_DATE,CLIENT_ID) values ?`

                    var recordData = []

                    for (let i = 0; i < data.length; i++) {
                        const dataItem = data[i];

                        var rec = [dataItem.PROPOSAL_ID, dataItem.PROPERTY_INFORMATION_ID, dataItem.VALUATOR_NAME, dataItem.VALUATION_AMOUNT, dataItem.VALUATION_DATE, dataItem.CLIENT_ID]

                        recordData.push(rec);

                    }


                    db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                        if (error) {
                            console.log(error);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update property Security Information ."
                            });
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "Property Security Information  updated successfully ."
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
