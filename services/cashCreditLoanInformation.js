const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var cashCreditLoanInformation = "cash_credit_loan_information";
var viewCashCreditLoanInformation = "view_" + cashCreditLoanInformation;



function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        PURPOSE_OF_LOAN: req.body.PURPOSE_OF_LOAN,
        APPROXIMATE_DAILY_SALES: req.body.APPROXIMATE_DAILY_SALES ? req.body.APPROXIMATE_DAILY_SALES : 0,
        APPROXIMATE_MONTHLY_SALES: req.body.APPROXIMATE_MONTHLY_SALES ? req.body.APPROXIMATE_MONTHLY_SALES : 0,
        APPROXIMATE_MONTHLY_CREDIT_SALES: req.body.APPROXIMATE_MONTHLY_CREDIT_SALES ? req.body.APPROXIMATE_MONTHLY_CREDIT_SALES : 0,
        AVERAGE_RECOVERY_PERIOD: req.body.AVERAGE_RECOVERY_PERIOD,
        APPROXIMATE_MONTHLY_PURCHASE: req.body.APPROXIMATE_MONTHLY_PURCHASE ? req.body.APPROXIMATE_MONTHLY_PURCHASE : 0,
        APPROXIMATE_MONTHLY_CREDIT_PURCHASE: req.body.APPROXIMATE_MONTHLY_CREDIT_PURCHASE ? req.body.APPROXIMATE_MONTHLY_CREDIT_PURCHASE : 0,
        AVERAGE_CREDIT_PERIOD: req.body.AVERAGE_CREDIT_PERIOD,
        APPROXIMATE_MONTHLY_STOCK: req.body.APPROXIMATE_MONTHLY_STOCK,
        IS_ANY_PURCHASE_FROM_SISTER_CONCERN_FIRM: req.body.IS_ANY_PURCHASE_FROM_SISTER_CONCERN_FIRM ? '1' : '0',
        IS_ANY_SALES_FROM_SISTER_CONCERN_FIRM: req.body.IS_ANY_SALES_FROM_SISTER_CONCERN_FIRM ? '1' : '0',
        IS_STOCK_IS_INSURED: req.body.IS_STOCK_IS_INSURED ? '1' : '0',
        SUM_INSURED_AMOUNT: req.body.SUM_INSURED_AMOUNT ? req.body.SUM_INSURED_AMOUNT : 0,
        IS_DEBTOR_LIST_PREPARED_ON_TIME: req.body.IS_DEBTOR_LIST_PREPARED_ON_TIME ? '1' : '0',
        IS_STOCK_MAINTAINED_AT_OTHER_PLACE: req.body.IS_STOCK_MAINTAINED_AT_OTHER_PLACE ? '1' : '0',
        ADDRESS_ID: req.body.ADDRESS_ID,
        IS_THERE_ANY_OBSOLUTE_DAMAGED_STOCK: req.body.IS_THERE_ANY_OBSOLUTE_DAMAGED_STOCK ? '1' : '0',
        AMOUNT_OF_OBSOLUTE_DAMAGED_PRODUCTS: req.body.AMOUNT_OF_OBSOLUTE_DAMAGED_PRODUCTS ? req.body.AMOUNT_OF_OBSOLUTE_DAMAGED_PRODUCTS : 0,
        CASH_CREDIT_TYPE: req.body.CASH_CREDIT_TYPE ,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('PURPOSE_OF_LOAN', ' parameter missing').exists(), body('APPROXIMATE_DAILY_SALES').isDecimal(), body('APPROXIMATE_MONTHLY_SALES').isDecimal(), body('APPROXIMATE_MONTHLY_CREDIT_SALES').isDecimal().optional(), body('AVERAGE_RECOVERY_PERIOD').optional(), body('APPROXIMATE_MONTHLY_PURCHASE').isDecimal().optional(), body('APPROXIMATE_MONTHLY_CREDIT_PURCHASE').isDecimal().optional(), body('AVERAGE_CREDIT_PERIOD').optional(), body('APPROXIMATE_MONTHLY_STOCK').optional(), body('SUM_INSURED_AMOUNT').isDecimal().optional(), body('ADDRESS_ID').isInt().optional(), body('AMOUNT_OF_OBSOLUTE_DAMAGED_PRODUCTS').isDecimal().optional(), body('CASH_CREDIT_TYPE', ' parameter missing').exists(), body('ID').optional(),

        body('IS_ANY_PURCHASE_FROM_SISTER_CONCERN_FIRM').optional().toInt().isInt(),
        body('IS_ANY_SALES_FROM_SISTER_CONCERN_FIRM').optional().toInt().isInt(),
        body('IS_STOCK_IS_INSURED').optional().toInt().isInt(),
        body('IS_DEBTOR_LIST_PREPARED_ON_TIME').optional().toInt().isInt(),
        body('IS_STOCK_MAINTAINED_AT_OTHER_PLACE').optional().toInt().isInt(),
        body('IS_THERE_ANY_OBSOLUTE_DAMAGED_STOCK').optional().toInt().isInt(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewCashCreditLoanInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get cashCreditLoanInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewCashCreditLoanInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get cashCreditLoanInformation information."
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
    var cashCreditAddressDetails = req.body.ADDRESS_DETAILS;
    var connection = db.openConnection();

    if (!errors.isEmpty()) {

        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    }
    else {
        try {
            db.executeDML(`INSERT INTO ` + cashCreditLoanInformation + ` SET ?`, data, supportKey,connection, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to save cashCreditLoanInformation information..."
                    });
                }
                else {
                    console.log(results);
                    if (data.IS_STOCK_MAINTAINED_AT_OTHER_PLACE == '1' && cashCreditAddressDetails.length > 0) {
                        updateAddressIDDetails(req, res, supportKey, connection, criteria.ID, cashCreditAddressDetails)

                    }
                    else {
                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "cash credit Information updated successfully...",
                        });
                    }
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
    var connection = db.openConnection();

    var cashCreditAddressDetails = req.body.ADDRESS_DETAILS;
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
            db.executeDML(`UPDATE ` + cashCreditLoanInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey,connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update cashCreditLoanInformation information."
                    });
                }
                else {
                    console.log(results);

                    if (data.IS_STOCK_MAINTAINED_AT_OTHER_PLACE == '1' && cashCreditAddressDetails.length > 0) {
                        updateAddressIDDetails(req, res, supportKey, connection, criteria.ID, cashCreditAddressDetails)

                    }
                    else {
                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "cash credit Information updated successfully...",
                        });
                    }
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
        }
    }
}





function updateAddressIDDetails(req, res, supportKey, connection, CASH_CREDIT_INFORMATION_ID, addressDetails) {
    try {

        db.executeDML(`DELETE FROM cash_credit_address_details WHERE CASH_CREDIT_INFORMATION_ID = ${CASH_CREDIT_INFORMATION_ID}`, '', supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save travellingDetailsInformation information..."
                });
            }
            else {

                var insertQuery = `Insert into cash_credit_address_details( CASH_CREDIT_INFORMATION_ID,ADDRESS_ID,CLIENT_ID) values ?`

                var recordData = [];

                for (let i = 0; i < addressDetails.length; i++) {
                    const dataItem = addressDetails[i];

                    var rec = [CASH_CREDIT_INFORMATION_ID, dataItem.ADDRESS_ID, dataItem.CLIENT_ID]

                    recordData.push(rec);

                }

                db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save CashCreditLoanInformation information..."
                        });
                    }
                    else {
                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "CashCreditLoanInformation information updated successfully...",
                        });
                    }
                });
            }
        });

    } catch (error) {
        console.log(error)
    }
}




exports.addCashCreditInformation = (req,res) => {   
    try {

        const errors = validationResult(req);
        //console.log(req.body);
        var data = reqData(req);

        var cashCreditAddressDetails = req.body.ADDRESS_DETAILS;
        
        var supportKey = req.headers['supportkey'];
        var criteria = {
            ID: req.body.ID,
        };

        if (!errors.isEmpty()) {
            console.log(errors);
            res.send({
                "code": 422,
                "message": errors.errors
            });
        }
        else {
            var connection = db.openConnection();
            if (criteria.ID) {
                var systemDate = mm.getSystemDate();
                var setData = "";
                var recordData = [];
                Object.keys(data).forEach(key => {
                    data[key] ? setData += `${key}= ? , ` : true;
                    data[key] ? recordData.push(data[key]) : true;
                });
                db.executeDML(`UPDATE ` + cashCreditLoanInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, resultsUpdate) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update cashCreditLoanInformation information."
                        });
                    }
                    else {
                        //console.log(results);

                        if (data.IS_STOCK_MAINTAINED_AT_OTHER_PLACE == '1' && cashCreditAddressDetails.length > 0) {
                            updateAddressDetails(req, res, supportKey, connection, criteria.ID,cashCreditAddressDetails )
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "cash credit Information updated successfully...",
                            });
                        }

                    }
                });
            }
            else {
                db.executeDML('INSERT INTO ' + cashCreditLoanInformation + ' SET ?', data, supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save cashCreditLoanInformation information..."
                        });
                    }
                    else {
                       // console.log(results);

                        if (data.IS_STOCK_MAINTAINED_AT_OTHER_PLACE == '1' && cashCreditAddressDetails.length > 0) {
                            updateAddressDetails(req, res, supportKey, connection, resultsInsert.insertId,cashCreditAddressDetails )
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "cash credit Information updated successfully...",
                            });
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

}


var async = require('async');
function updateAddressDetails(req, res, supportKey, connection, CASH_CREDIT_INFORMATION_ID, addressDetails)
{
try {
    
    db.executeDML(`Delete from address_information where ID IN (SELECT ADDRESS_ID FROM cash_credit_address_details WHERE CASH_CREDIT_INFORMATION_ID = ${CASH_CREDIT_INFORMATION_ID})`, '', supportKey, connection, (error, resultsLast3YearUpdate) => {
        if (error) {
            console.log(error);
            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
            db.rollbackConnection(connection);
            res.send({
                "code": 400,
                "message": "Failed to update cash credit Information..."
            });
        }
        else {
            db.executeDML(`Delete from cash_credit_address_details where CASH_CREDIT_INFORMATION_ID  =  ${CASH_CREDIT_INFORMATION_ID}`, '', supportKey, connection, (error, resultsLast3YearUpdate1) => {
                if (error) {
                    console.log(error);
                    //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update cash credit Information..."
                    });
                }
                else {
                    async.eachSeries(addressDetails, function iteratorOverElems(addressData, callback) {

                        db.executeDML(`insert into  address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) values(?,?,?,?,?,?,?,?,?)`,[addressData.STATE,addressData.DISTRICT,addressData.TALUKA,addressData.VILLAGE,addressData.PINCODE,addressData.LANDMARK,addressData.BUILDING,addressData.HOUSE_NO,addressData.CLIENT_ID], supportKey, connection, (error, resultsInsert) => {
                            if (error) {
                                console.log(error);
                                callback(error);
                            }
                            else {
                                db.executeDML(`insert into cash_credit_address_details(CASH_CREDIT_INFORMATION_ID,ADDRESS_ID,CLIENT_ID) values(?,?,?)`,[CASH_CREDIT_INFORMATION_ID,resultsInsert.insertId,addressData.CLIENT_ID], supportKey, connection, (error, resultsInsert1) => {
                                    if (error) {
                                        console.log(error);
                                        callback(error);
                                    }
                                    else {
                                        callback()
                                    }
                                });
                            }
                        });

                    }, function subCb(error) {
                        if (error) {
                            //rollback
                            console.log(error);
                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceId);
                            db.rollbackConnection(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to update cash credit Information..."
                            });
                        } else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "cash credit Information updated successfully...",
                            });
                                                     
                        }
                    });
                }
            });
        }
    });

} catch (error) {
    console.log(error);
}

}