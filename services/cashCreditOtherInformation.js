const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var cashCreditOtherInformation = "cash_credit_other_information";
var viewCashCreditOtherInformation = "view_" + cashCreditOtherInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        PURPOSE_OF_CASH_CREDIT: req.body.PURPOSE_OF_CASH_CREDIT,
        IS_ANY_WORK_ORDER_IN_HAND: req.body.IS_ANY_WORK_ORDER_IN_HAND ? '1' : '0',
        IS_MAIN_CONTRACTOR_OR_SUB_CONTRACTOR: req.body.IS_MAIN_CONTRACTOR_OR_SUB_CONTRACTOR,
        EXPECTED_NET_PROFIT: req.body.EXPECTED_NET_PROFIT ? req.body.EXPECTED_NET_PROFIT : 0,
        EXPECTED_AMOUNT_OF_WORK_ORDERS: req.body.EXPECTED_AMOUNT_OF_WORK_ORDERS ? req.body.EXPECTED_AMOUNT_OF_WORK_ORDERS : 0,
        IS_ANY_SUB_CONTRACTOR: req.body.IS_ANY_SUB_CONTRACTOR ? '1' : '0',

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('PURPOSE_OF_CASH_CREDIT', ' parameter missing').exists(),
        body('IS_MAIN_CONTRACTOR_OR_SUB_CONTRACTOR', ' parameter missing').exists(),
        body('EXPECTED_NET_PROFIT').isDecimal().optional(),
        body('EXPECTED_AMOUNT_OF_WORK_ORDERS').isDecimal().optional(),
        body('ID').optional(),

        body('IS_ANY_WORK_ORDER_IN_HAND').optional().toInt().isInt(),
        body('IS_ANY_SUB_CONTRACTOR').optional().toInt().isInt(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewCashCreditOtherInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get cashCreditOtherInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewCashCreditOtherInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get cashCreditOtherInformation information."
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
            mm.executeQueryData('INSERT INTO ' + cashCreditOtherInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save cashCreditOtherInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "CashCreditOtherInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + cashCreditOtherInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update cashCreditOtherInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "CashCreditOtherInformation information updated successfully...",
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




exports.addCashCreditInformation = (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);
    var supportKey = req.headers['supportkey'];

    var workOrderDetails = req.body.WORK_ORDER_DETAILS;

    if (!errors.isEmpty()) {

        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    }
    else {
        try {
            var criteria = {
                ID: req.body.ID,
            };
            var connection = db.openConnection();
            if (criteria.ID) {

                var systemDate = mm.getSystemDate();
                var setData = "";
                var recordData = [];
                Object.keys(data).forEach(key => {

                    //data[key] ? setData += `${key}= '${data[key]}', ` : true;
                    // setData += `${key}= :"${key}", `;
                    data[key] ? setData += `${key}= ? , ` : true;
                    data[key] ? recordData.push(data[key]) : true;
                });


                db.executeDML(`UPDATE ` + cashCreditOtherInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update cashCreditOtherInformation information."
                        });
                    }
                    else {
                        console.log(results);
                        addWorkOrderDetails(criteria.ID, workOrderDetails, supportKey, connection, req, res)
                    }
                });


            }
            else {

                db.executeDML('INSERT INTO ' + cashCreditOtherInformation + ' SET ?', data, supportKey, connection, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to save cashCreditOtherInformation information..."
                        });
                    }
                    else {
                        console.log(results);
                        criteria.ID = results.insertId;
                        addWorkOrderDetails(criteria.ID, workOrderDetails, supportKey, connection, req, res)

                    }
                });

            }


        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error)
        }
    }
}



function addWorkOrderDetails(CASH_CREDIT_OTHER_ID, workOrderDetails, supportKey, connection, req, res) {
    try {
        if (workOrderDetails.length > 0) {

            db.executeDML(`DELETE FROM work_order_details WHERE CASH_CREDIT_OTHER_ID = ${CASH_CREDIT_OTHER_ID}`, '', supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update Cash Credit Other Information ."
                    });

                }
                else {

                    var insertQuery = `Insert into work_order_details( CASH_CREDIT_OTHER_ID,NAME_OF_ORGANIZATION_OR_PERSON,AMOUNT_OF_WORK_ORDER,START_DATE,END_DATE,CLIENT_ID) values ?`

                    var recordData = []

                    for (let i = 0; i < workOrderDetails.length; i++) {
                        const dataItem = workOrderDetails[i];

                        var rec = [CASH_CREDIT_OTHER_ID, dataItem.NAME_OF_ORGANIZATION_OR_PERSON, dataItem.AMOUNT_OF_WORK_ORDER, dataItem.START_DATE, dataItem.END_DATE, dataItem.CLIENT_ID]

                        recordData.push(rec);

                    }

                    db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                        if (error) {
                            console.log(error);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update Cash Credit Other Information ."
                            });
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "CashCreditOtherInformation information saved successfully...",
                            });
                        }
                    });
                }
            });
            
        }
        else {
            db.commitConnection(connection);
            res.send({
                "code": 200,
                "message": "CashCreditOtherInformation information saved successfully...",
            });
        }
    } catch (error) {
        console.log(error);
    }
}