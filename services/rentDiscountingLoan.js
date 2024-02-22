const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var rentDiscountingLoan = "rent_discounting_loan";
var viewRentDiscountingLoan = "view_" + rentDiscountingLoan;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        RENTED_BULDING_TYPE: req.body.RENTED_BULDING_TYPE,
        IS_OWNER: req.body.IS_OWNER ? '1' : '0',
        ADDRESS_ID: req.body.ADDRESS_ID,
        NAME_OF_TENANT: req.body.NAME_OF_TENANT,
        TENENT_TYPE: req.body.TENENT_TYPE,
        RENTED_GIVEN_TIME: req.body.RENTED_GIVEN_TIME,
        IS_RENT_AGREEMENT_DONE: req.body.IS_RENT_AGREEMENT_DONE ? '1' : '0',
        RENT_AGREEMNT_TIME: req.body.RENT_AGREEMNT_TIME,
        RENT_AGREEMENT_END_DATE: req.body.RENT_AGREEMENT_END_DATE,
        MONTHLY_RENT: req.body.MONTHLY_RENT ? req.body.MONTHLY_RENT : 0,
        IS_RENT_TAKEN_CASH_OR_IN_BANK: req.body.IS_RENT_TAKEN_CASH_OR_IN_BANK,
        RENT_BANK_NAME: req.body.RENT_BANK_NAME,
        IS_DONE_TDS_CUTTING: req.body.IS_DONE_TDS_CUTTING ? '1' : '0',
        AMOUNT_AFTER_TDS_CUTTING: req.body.AMOUNT_AFTER_TDS_CUTTING ? req.body.AMOUNT_AFTER_TDS_CUTTING : 0,
        IS_ANY_BANK_LOAN_TAKEN: req.body.IS_ANY_BANK_LOAN_TAKEN ? '1' : '0',
        LOAN_BANK_NAME: req.body.LOAN_BANK_NAME,
        SANCTIONED_LOAN_AMOUNT: req.body.SANCTIONED_LOAN_AMOUNT ? req.body.SANCTIONED_LOAN_AMOUNT : 0,
        REMAINING_LOAN_AMOUNT: req.body.REMAINING_LOAN_AMOUNT ? req.body.REMAINING_LOAN_AMOUNT : 0,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('RENTED_BULDING_TYPE', ' parameter missing').exists(), body('ADDRESS_ID').isInt(), body('NAME_OF_TENANT', ' parameter missing').exists(), body('TENENT_TYPE', ' parameter missing').exists(), body('RENTED_GIVEN_TIME').isInt(), body('RENT_AGREEMNT_TIME').isInt().optional(), body('RENT_AGREEMENT_END_DATE').optional(), body('MONTHLY_RENT').isDecimal().optional(), body('IS_RENT_TAKEN_CASH_OR_IN_BANK').optional(), body('RENT_BANK_NAME').optional(), body('AMOUNT_AFTER_TDS_CUTTING').isDecimal().optional(), body('LOAN_BANK_NAME').optional(), body('SANCTIONED_LOAN_AMOUNT').isDecimal().optional(), body('REMAINING_LOAN_AMOUNT').isDecimal().optional(), body('ID').optional(),

        body('IS_OWNER').optional().toInt().isInt(),
        body('IS_RENT_AGREEMENT_DONE').optional().toInt().isInt(),
        body('IS_DONE_TDS_CUTTING').optional().toInt().isInt(),
        body('IS_ANY_BANK_LOAN_TAKEN').optional().toInt().isInt(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewRentDiscountingLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get rentDiscountingLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewRentDiscountingLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get rentDiscountingLoan information."
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
            mm.executeQueryData('INSERT INTO ' + rentDiscountingLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save rentDiscountingLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RentDiscountingLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + rentDiscountingLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update rentDiscountingLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RentDiscountingLoan information updated successfully...",
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
