const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var realEstateTopUpLoan = "real_estate_top_up_loan";
var viewRealEstateTopUpLoan = "view_" + realEstateTopUpLoan;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        IS_APPLIED_FOR_LOAN_INTEREST_GOVERNMENT_SUBSIDY: req.body.IS_APPLIED_FOR_LOAN_INTEREST_GOVERNMENT_SUBSIDY ? '1' : '0',
        IS_TAKEN_LOAN_INTEREST_GOVERNMENT_SUBSIDY: req.body.IS_TAKEN_LOAN_INTEREST_GOVERNMENT_SUBSIDY ? '1' : '0',
        TOP_UP_LOAN_REASON: req.body.TOP_UP_LOAN_REASON,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('ID').optional(),
        body('IS_APPLIED_FOR_LOAN_INTEREST_GOVERNMENT_SUBSIDY').optional().toInt().isInt(),
        body('IS_TAKEN_LOAN_INTEREST_GOVERNMENT_SUBSIDY').optional().toInt().isInt(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewRealEstateTopUpLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get realEstateTopUpLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewRealEstateTopUpLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get realEstateTopUpLoan information."
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
            mm.executeQueryData('INSERT INTO ' + realEstateTopUpLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save realEstateTopUpLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RealEstateTopUpLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + realEstateTopUpLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update realEstateTopUpLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RealEstateTopUpLoan information updated successfully...",
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








exports.addTopUpLoan = (req, res) => {
    try {

        const errors = validationResult(req);
        //console.log(req.body);
        var data = reqData(req);
        var supportKey = req.headers['supportkey'];
        var criteria = {
            ID: req.body.ID,
        };

        var reasonDetails = req.body.REASON_DETAILS;

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
            db.executeDML(`UPDATE ` + realEstateTopUpLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update realEstateTopUpLoan information."
                    });
                }
                else {
                    console.log(results);
                    addReasonDetails(criteria.ID, req, res, connection, supportKey, reasonDetails)
                }
            });

        }
        else {
            db.executeDML('INSERT INTO ' + realEstateTopUpLoan + ' SET ?', data, supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to save realEstateTopUpLoan information..."
                    });
                }
                else {
                    console.log(results);
                    addReasonDetails(results.insertId, req, res, connection, supportKey, reasonDetails)
                }
            });

        }
    } catch (error) {
        console.log(error);
    }
}






function addReasonDetails(REAL_ESTATE_TOP_UP_LOAN_ID, req, res, connection, supportKey, reasonDetails) {
    try {
        db.executeDML(`DELETE FROM top_up_loan_reason_details WHERE REAL_ESTATE_TOP_UP_LOAN_ID = ${REAL_ESTATE_TOP_UP_LOAN_ID}`, '', supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save toursAndTravelLoan information..."
                });
            }
            else {

                var insertQuery = `Insert into top_up_loan_reason_details( REAL_ESTATE_TOP_UP_LOAN_ID,REASON,SPENT_AMOUNT,CLIENT_ID) values ?`

                var recordData = [];

                for (let i = 0; i < reasonDetails.length; i++) {
                    const dataItem = reasonDetails[i];

                    var rec = [REAL_ESTATE_TOP_UP_LOAN_ID, dataItem.REASON, dataItem.SPENT_AMOUNT, dataItem.CLIENT_ID]

                    recordData.push(rec);

                }

                db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save toursAndTravelLoan information..."
                        });
                    }
                    else {
                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "ToursAndTravelLoan information updated successfully...",
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }

}
