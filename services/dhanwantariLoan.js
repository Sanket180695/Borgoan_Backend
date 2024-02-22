const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var dhanwantariLoan = "dhanwantari_loan";
var viewDhanwantariLoan = "view_" + dhanwantariLoan;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        PURPOSE_OF_LOAN: req.body.PURPOSE_OF_LOAN,
        PROFESSIONAL_EXPERTISE_SKILL: req.body.PROFESSIONAL_EXPERTISE_SKILL,
        AVAILABILITY: req.body.AVAILABILITY,
        TYPE: req.body.TYPE,
        NAME_OF_DEALER_FIRM: req.body.NAME_OF_DEALER_FIRM,
        DATE_OF_QUOTATION: req.body.DATE_OF_QUOTATION,
        AMOUNT_OF_QUOTATION: req.body.AMOUNT_OF_QUOTATION ? req.body.AMOUNT_OF_QUOTATION : 0,
        VALIDITY: req.body.VALIDITY,
        PURCHASE_AMOUNT: req.body.PURCHASE_AMOUNT ? req.body.PURCHASE_AMOUNT : 0,
        ADVANCE_PAYMENT_TO_DEALER: req.body.ADVANCE_PAYMENT_TO_DEALER ? req.body.ADVANCE_PAYMENT_TO_DEALER : 0,
        ADVANCE_PAYMENT_TO_DEALER: req.body.ADVANCE_PAYMENT_TO_DEALER ? req.body.ADVANCE_PAYMENT_TO_DEALER : 0,
        IS_AGREEMENT_WITH_DEALER: req.body.IS_AGREEMENT_WITH_DEALER ? '1' : '0',
        NATURE_OF_MACHINERY: req.body.NATURE_OF_MACHINERY,
        DETAILS_OF_MACHINERY: req.body.DETAILS_OF_MACHINERY,
        IS_RELATED_TO_BUSINESS: req.body.IS_RELATED_TO_BUSINESS ? '1' : '0',
        ADVANCE_PAYMENT_TO_DEALER: req.body.ADVANCE_PAYMENT_TO_DEALER ? req.body.ADVANCE_PAYMENT_TO_DEALER : 0,
        YEAR_OF_ORIGINAL_PURCHASE: req.body.YEAR_OF_ORIGINAL_PURCHASE,
        EXPECTED_INCOME_PER_ANNUM: req.body.EXPECTED_INCOME_PER_ANNUM ? req.body.EXPECTED_INCOME_PER_ANNUM : 0,
        ADDRESS_ID: req.body.ADDRESS_ID,
        AREA_OF_PLOT: req.body.AREA_OF_PLOT,
        IS_PLOT_NA_OR_NA_ORDERED: req.body.IS_PLOT_NA_OR_NA_ORDERED,
        IS_ALL_GOVERNMENT_DUES_PAID: req.body.IS_ALL_GOVERNMENT_DUES_PAID ? '1' : '0',
        IS_CONSTRUCTION_PLAN_READY: req.body.IS_CONSTRUCTION_PLAN_READY ? '1' : '0',
        IS_PERMISSION_OF_CONSTRUCTION: req.body.IS_PERMISSION_OF_CONSTRUCTION ? '1' : '0',
        NAME_OF_BUILDER_DEVELOPER: req.body.NAME_OF_BUILDER_DEVELOPER,
        TOTAL_AREA_OF_CONSTRUCTION: req.body.TOTAL_AREA_OF_CONSTRUCTION,
        TOTAL_COST_OF_CONSTRUCTION: req.body.TOTAL_COST_OF_CONSTRUCTION ? req.body.TOTAL_COST_OF_CONSTRUCTION : 0,
        EXPECTED_TIME_OF_CONSTRUCTION: req.body.EXPECTED_TIME_OF_CONSTRUCTION,

        CLIENT_ID: req.body.CLIENT_ID,

        IS_VALUATION_DONE: req.body.IS_VALUATION_DONE ? '1' : '0',
        VALUATOR_NAME: req.body.VALUATOR_NAME,
        VALUATION_DATE: req.body.VALUATION_DATE,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT ? req.body.VALUATION_AMOUNT : '0',
        COMPANY_OF_MACHINERY: req.body.COMPANY_OF_MACHINERY,
        IS_PAID_ADVANCE_AMOUNT: req.body.IS_PAID_ADVANCE_AMOUNT ? '1' : '0',

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('PURPOSE_OF_LOAN').optional(), body('PROFESSIONAL_EXPERTISE_SKILL').optional(), body('AVAILABILITY').optional(), body('TYPE').optional(), body('NAME_OF_DEALER_FIRM').optional(), body('DATE_OF_QUOTATION').optional(), body('AMOUNT_OF_QUOTATION').isDecimal().optional(), body('VALIDITY').optional(), body('PURCHASE_AMOUNT').isDecimal().optional(), body('ADVANCE_PAYMENT_TO_DEALER').isDecimal().optional(), body('ADVANCE_PAYMENT_TO_DEALER').isDecimal().optional(), body('NATURE_OF_MACHINERY').optional(), body('DETAILS_OF_MACHINERY').optional(), body('ADVANCE_PAYMENT_TO DEALER').isDecimal().optional(), body('YEAR_OF_ORIGINAL_PURCHASE').optional(), body('EXPECTED_INCOME_PER_ANNUM').isDecimal().optional(), body('ADDRESS_ID').isInt().optional(), body('AREA_OF_PLOT').optional(), body('IS_PLOT_NA_OR_NA_ORDERED').optional(), body('NAME_OF_BUILDER_DEVELOPER').optional(), body('TOTAL_AREA_OF_CONSTRUCTION').isInt().optional(), body('TOTAL_COST_OF_CONSTRUCTION').isDecimal().optional(), body('EXPECTED_TIME_OF_CONSTRUCTION').optional(), body('ID').optional(),
        body('IS_AGREEMENT_WITH_DEALER').optional().toInt().isInt(),
        body('IS_RELATED_TO_BUSINESS').optional().toInt().isInt(),
        body('IS_ALL_GOVERNMENT_DUES_PAID').optional().toInt().isInt(),
        body('IS_CONSTRUCTION_PLAN_READY').optional().toInt().isInt(),
        body('IS_PERMISSION_OF_CONSTRUCTION').optional().toInt().isInt(),
        body('IS_VALUATION_DONE').optional().toInt().isInt(),
        body('IS_PAID_ADVANCE_AMOUNT').optional().toInt().isInt(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewDhanwantariLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get dhanwantariLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewDhanwantariLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get dhanwantariLoan information."
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
    console.log(req.body);
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
            mm.executeQueryData('INSERT INTO ' + dhanwantariLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save dhanwantariLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "DhanwantariLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + dhanwantariLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update dhanwantariLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "DhanwantariLoan information updated successfully...",
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
