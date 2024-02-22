const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var shikshanSavardhiniLoan = "shikshan_savardhini_loan";
var viewShikshanSavardhiniLoan = "view_" + shikshanSavardhiniLoan;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        CHIELD_NAME: req.body.CHIELD_NAME,
        LAST_DEGREE: req.body.LAST_DEGREE,
        LAST_COLLEGE_NAME: req.body.LAST_COLLEGE_NAME,
        LAST_DEGREE_PERCENTAGE: req.body.LAST_DEGREE_PERCENTAGE ? req.body.LAST_DEGREE_PERCENTAGE : 0,
        COURSE_NAME: req.body.COURSE_NAME,
        COURSE_DURATION: req.body.COURSE_DURATION,
        COURSE_COLLEGE: req.body.COURSE_COLLEGE,
        IS_COURSE_COLLEGE_ABROAD: req.body.IS_COURSE_COLLEGE_ABROAD ? '1' : '0',
        COURSE_COLLEGE_ADDRESS: req.body.COURSE_COLLEGE_ADDRESS,
        COURSE_FEES_TOTAL: req.body.COURSE_FEES_TOTAL ? req.body.COURSE_FEES_TOTAL : 0,
        COURSE_FEES_FIRST_YEAR: req.body.COURSE_FEES_FIRST_YEAR ? req.body.COURSE_FEES_FIRST_YEAR : 0,
        IS_ADMISSION_TAKEN: req.body.IS_ADMISSION_TAKEN ? '1' : '0',
        IS_COURSE_ELIGIBLE_FOR_SUBSIDY: req.body.IS_COURSE_ELIGIBLE_FOR_SUBSIDY ? '1' : '0',
        TENTATIVE_AMOUNT_OF_SUBSIDY: req.body.TENTATIVE_AMOUNT_OF_SUBSIDY ? req.body.TENTATIVE_AMOUNT_OF_SUBSIDY : 0,
        IS_ELIGIBLE_FOR_ADDITIONAL_BENEFITS: req.body.IS_ELIGIBLE_FOR_ADDITIONAL_BENEFITS ? '1' : '0',
        ADDITIONAL_BENEFITS_DETAILS: req.body.ADDITIONAL_BENEFITS_DETAILS,
        IS_TAKEN_ANY_OTHER_LOANS: req.body.IS_TAKEN_ANY_OTHER_LOANS ? '1' : '0',

        CLIENT_ID: req.body.CLIENT_ID,
        EXTRA_BENEFITS_AMOUNT: req.body.EXTRA_BENEFITS_AMOUNT,
        DETAILS_OF_SUBSIDY: req.body.DETAILS_OF_SUBSIDY,
    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('CHIELD_NAME').optional(), body('LAST_DEGREE').optional(), body('LAST_COLLEGE_NAME').optional(), body('LAST_DEGREE_PERCENTAGE').isDecimal().optional(), body('COURSE_NAME').optional(), body('COURSE_DURATION').isInt().optional(), body('COURSE_COLLEGE').optional(), body('COURSE_COLLEGE_ADDRESS').optional(), body('COURSE_FEES_TOTAL').isDecimal().optional(), body('COURSE_FEES_FIRST_YEAR').isDecimal().optional(), body('TENTATIVE_AMOUNT_OF_SUBSIDY').isDecimal().optional(), body('ADDITIONAL_BENEFITS_DETAILS').optional(), body('ID').optional(),
        body('IS_COURSE_COLLEGE_ABROAD').optional().toInt().isInt(),
        body('IS_ADMISSION_TAKEN').optional().toInt().isInt(),
        body('IS_COURSE_ELIGIBLE_FOR_SUBSIDY').optional().toInt().isInt(),
        body('IS_ELIGIBLE_FOR_ADDITIONAL_BENEFITS').optional().toInt().isInt(),
        body('IS_TAKEN_ANY_OTHER_LOANS').optional().toInt().isInt(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewShikshanSavardhiniLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get shikshanSavardhiniLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewShikshanSavardhiniLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get shikshanSavardhiniLoan information."
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
            mm.executeQueryData('INSERT INTO ' + shikshanSavardhiniLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save shikshanSavardhiniLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ShikshanSavardhiniLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + shikshanSavardhiniLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update shikshanSavardhiniLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ShikshanSavardhiniLoan information updated successfully...",
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







exports.addLoanExtraInformation = (req, res) => {
    try {

        var data = reqData(req);
        var feeDetails = req.body.FEE_DETAILS;
        var ID = req.body.ID;
        var connection = db.openConnection();
        var supportKey = req.headers['supportkey']

        if (data && feeDetails) {
            if (ID) {
                var systemDate = mm.getSystemDate();
                var setData = "";
                var recordData = [];
                Object.keys(data).forEach(key => {

                    //data[key] ? setData += `${key}= '${data[key]}', ` : true;
                    // setData += `${key}= :"${key}", `;
                    data[key] ? setData += `${key}= ? , ` : true;
                    data[key] ? recordData.push(data[key]) : true;
                });

                db.executeDML(`UPDATE ` + shikshanSavardhiniLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${ID} `, recordData, supportKey, connection, (error, results) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        db.rollbackConnection(connection);
                        console.log(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to update shikshanSavardhiniLoan information."
                        });
                    }
                    else {
                        console.log(results);

                        addFeeDetails(supportKey, req, res, feeDetails, ID, connection);

                    }
                });

            }
            else {
                db.executeDML('INSERT INTO ' + shikshanSavardhiniLoan + ' SET ?', data, supportKey, connection, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save shikshanSavardhiniLoan information..."
                        });
                    }
                    else {
                        console.log(results);
                        addFeeDetails(supportKey, req, res, feeDetails, results.insertId, connection)

                    }
                });

            }
        }
        else {
            res.send({
                "code": 200,
                "message": "parameter missing - feeDetails",
            });
        }

    } catch (error) {
        console.log(error)
    }
}



function addFeeDetails(supportKey, req, res, feeDetails, SHIKSHAN_SANVARDHINI_LOAN_ID, connection) {
    try {
        db.executeDML(`DELETE FROM fee_details WHERE SHIKSHAN_SANVARDHINI_LOAN_ID = ?`, [SHIKSHAN_SANVARDHINI_LOAN_ID], supportKey, connection, (error, resultsDelete) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save shikshanSavardhiniLoan information..."
                });
            }
            else {

                if (feeDetails.length > 0) {
                    var insertQuery = `INSERT INTO fee_details(SHIKSHAN_SANVARDHINI_LOAN_ID,TYPE,FEE_NAME,AMOUNT,CLIENT_ID) VALUES ?`;

                    var recordData = [];


                    for (let i = 0; i < feeDetails.length; i++) {
                        const feeData = feeDetails[i];


                        var rec = [SHIKSHAN_SANVARDHINI_LOAN_ID, feeData.TYPE, feeData.FEE_NAME, feeData.AMOUNT, feeData.CLIENT_ID]

                        recordData.push(rec);

                    }

                    db.executeDML(insertQuery, [recordData], supportKey, connection, (error, results) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection)
                            res.send({
                                "code": 400,
                                "message": "Failed to save shikshanSavardhiniLoan information..."
                            });
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "ShikshanSavardhiniLoan information saved successfully...",
                            });
                        }
                    });
                }
                else {
                    db.commitConnection(connection);
                    res.send({
                        "code": 200,
                        "message": "ShikshanSavardhiniLoan information saved successfully...",
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}



