const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var pladgeLoanInformation = "pladge_loan_information";
var viewPladgeLoanInformation = "view_" + pladgeLoanInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        STOCK_PLACE: req.body.STOCK_PLACE,
        NAME_OF_STOCK_STORAGE: req.body.NAME_OF_STOCK_STORAGE,
        STORAGE_OWNER_NAME: req.body.STORAGE_OWNER_NAME,
        ADDRESS_DETAILS_ID: req.body.ADDRESS_DETAILS_ID,
        IS_LOAN_TAKEN_FOR_STOCK_PLACE: req.body.IS_LOAN_TAKEN_FOR_STOCK_PLACE ? '1' : '0',
        BANK_NAME: req.body.BANK_NAME,
        IS_STOCK_PLACE_OWNED_OR_RENTED: req.body.IS_STOCK_PLACE_OWNED_OR_RENTED,
        IS_ANY_RENT_AGREEMENT_FOR_STOCK_PLACE: req.body.IS_ANY_RENT_AGREEMENT_FOR_STOCK_PLACE ? '1' : '0',
        DETAILS_OF_INSURENCE_OF_STOCK_PLACE: req.body.DETAILS_OF_INSURENCE_OF_STOCK_PLACE,
        RECEIPT_NUMBER: req.body.RECEIPT_NUMBER,
        STOCK_YEAR: req.body.STOCK_YEAR,
        VALUATION_OF_STOCK: req.body.VALUATION_OF_STOCK ? req.body.VALUATION_OF_STOCK : 0,
        VALUATORS_NAME: req.body.VALUATORS_NAME,
        VALUATION_DATE: req.body.VALUATION_DATE,
        DETAILS_OF_EXISTING_PLEDGE_LOAN: req.body.DETAILS_OF_EXISTING_PLEDGE_LOAN,

        CLIENT_ID: req.body.CLIENT_ID,
        IS_AVAILABLE_COLATERAL_MANAGER: req.body.IS_AVAILABLE_COLATERAL_MANAGER ? '1' : '0',
        IS_VALUATION_DONE: req.body.IS_VALUATION_DONE ? '1' : '0',

        STOCK_WEIGHT: req.body.STOCK_WEIGHT ? req.body.STOCK_WEIGHT : 0,
        WEIGHT_UNIT: req.body.WEIGHT_UNIT,
        STOCK_DETAILS: req.body.STOCK_DETAILS,

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('STOCK_PLACE').optional(),
        body('NAME_OF_STOCK_STORAGE', ' parameter missing').exists(),
        body('STORAGE_OWNER_NAME', ' parameter missing').exists(),
        body('ADDRESS_DETAILS_ID').isInt(),
        body('BANK_NAME', ' parameter missing').exists(),
        body('IS_STOCK_PLACE_OWNED_OR_RENTED', ' parameter missing').exists(),
        body('DETAILS_OF_INSURENCE_OF_STOCK_PLACE', ' parameter missing').exists(),
        body('RECEIPT_NUMBER', ' parameter missing').exists(),
        body('STOCK_YEAR', ' parameter missing').exists(),
        body('VALUATION_OF_STOCK').isDecimal(),
        body('VALUATORS_NAME', ' parameter missing').exists(),
        body('VALUATION_DATE', ' parameter missing').exists(),
        body('DETAILS_OF_EXISTING_PLEDGE_LOAN', ' parameter missing').exists(),
        body('ID').optional(),

        body('IS_LOAN_TAKEN_FOR_STOCK_PLACE').optional().toInt().isInt(),
        body('IS_ANY_RENT_AGREEMENT_FOR_STOCK_PLACE').optional().toInt().isInt(),
        body('IS_AVAILABLE_COLATERAL_MANAGER').optional().toInt().isInt(),
        body('IS_VALUATION_DONE').optional().toInt().isInt(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewPladgeLoanInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get pladgeLoanInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewPladgeLoanInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get pladgeLoanInformation information."
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
            mm.executeQueryData('INSERT INTO ' + pladgeLoanInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save pladgeLoanInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "PladgeLoanInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + pladgeLoanInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update pladgeLoanInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "PladgeLoanInformation information updated successfully...",
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