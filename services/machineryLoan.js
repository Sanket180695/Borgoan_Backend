const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var machineryLoan = "machinery_loan";
var viewMachineryLoan = "view_" + machineryLoan;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        PURPOSE_OF_LOAN: req.body.PURPOSE_OF_LOAN,  
        NATURE_OF_MACHINERY: req.body.NATURE_OF_MACHINERY,
        AVAILABILITY_TYPE: req.body.AVAILABILITY_TYPE,
        DETAILS_OF_MACHINERY: req.body.DETAILS_OF_MACHINERY,
        IS_RELATED_TO_BUSINESS: req.body.IS_RELATED_TO_BUSINESS ? '1' : '0',
        LIFE_OF_MACHINERY: req.body.LIFE_OF_MACHINERY,
        DEALER_NAME: req.body.DEALER_NAME,
        IS_ADVANCE_PAID: req.body.IS_ADVANCE_PAID ? '1' : '0',
        ADVANCE_PAID_AMOUNT: req.body.ADVANCE_PAID_AMOUNT ? req.body.ADVANCE_PAID_AMOUNT : '0.00',
        EXPECTED_TO_INCREASED_PRODUCTIVITY: req.body.EXPECTED_TO_INCREASED_PRODUCTIVITY ? req.body.EXPECTED_TO_INCREASED_PRODUCTIVITY : '',
        EXPECTED_PER_ANNUM_INCOME: req.body.EXPECTED_PER_ANNUM_INCOME ? req.body.EXPECTED_PER_ANNUM_INCOME : 0,
        MACHINERY_TYPE: req.body.MACHINERY_TYPE,
        QUOTATION_AMOUNT: req.body.QUOTATION_AMOUNT ? req.body.QUOTATION_AMOUNT : '0.00',
        QUOTATION_GIVEN_DATE: req.body.QUOTATION_GIVEN_DATE,
        IS_DONE_AGREEMENT: req.body.IS_DONE_AGREEMENT ? '1' : '0',
        YEAR_OF_PURCHASE: req.body.YEAR_OF_PURCHASE ? req.body.YEAR_OF_PURCHASE : '',
        PURCHASE_AMOUNT: req.body.PURCHASE_AMOUNT ? req.body.PURCHASE_AMOUNT : '0.00',
        CLIENT_ID: req.body.CLIENT_ID,
        IS_INDUSTRIAL_LOAN: req.body.IS_INDUSTRIAL_LOAN ? '1' : '0',
        IS_VALUATION_DONE: req.body.IS_ADVANCE_PAID ? '1' : '0',
        VALUATOR_NAME: req.body.VALUATOR_NAME,
        VALUATION_DATE: req.body.VALUATION_DATE,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT ? req.body.VALUATION_AMOUNT : 0,
        PRODUCTION_YEAR: req.body.PRODUCTION_YEAR,

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('PURPOSE_OF_LOAN').optional(),
        body('NATURE_OF_MACHINERY').optional(),
        body('AVAILABILITY_TYPE').optional(),
        body('DETAILS_OF_MACHINERY').optional(),
        body('LIFE_OF_MACHINERY').optional(),
        body('DEALER_NAME').optional(),
        body('ADVANCE_PAID_AMOUNT').isDecimal().optional(),
        body('EXPECTED_PER_ANNUM_INCOME').isDecimal().optional(),
        body('MACHINERY_TYPE').optional(),
        body('QUOTATION_AMOUNT').isDecimal().optional(),
        body('QUOTATION_GIVEN_DATE').optional(),
        body('YEAR_OF_PURCHASE').optional(),
        body('PURCHASE_AMOUNT').isDecimal().optional(),
        body('ID').optional(),

        body('IS_RELATED_TO_BUSINESS').optional().toInt().isInt(),
        body('IS_ADVANCE_PAID').optional().toInt().isInt(),
        body('IS_DONE_AGREEMENT').optional().toInt().isInt(),
        body('IS_INDUSTRIAL_LOAN').optional().toInt().isInt(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewMachineryLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get machineryLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewMachineryLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get machineryLoan information."
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
            mm.executeQueryData('INSERT INTO ' + machineryLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save machineryLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "MachineryLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + machineryLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update machineryLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "MachineryLoan information updated successfully...",
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

