const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var realEstateComercialLoan = "real_estate_comercial_loan";
var viewRealEstateComercialLoan = "view_" + realEstateComercialLoan;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        PURPOSE_OF_LOAN: req.body.PURPOSE_OF_LOAN,
        TYPE_OF_PROPERTY: req.body.TYPE_OF_PROPERTY,
        IS_FIRST_SALE_OR_RESALE: req.body.IS_FIRST_SALE_OR_RESALE,
        ADDRESS_ID: req.body.ADDRESS_ID,
        ADVANCE_PAYMENT: req.body.ADVANCE_PAYMENT ? req.body.ADVANCE_PAYMENT : 0,
        CARPET_AREA: req.body.CARPET_AREA,
        SELLABLE_AREA: req.body.SELLABLE_AREA,
        BOOKED_SHOP_OR_OFFICE_NUMBER: req.body.BOOKED_SHOP_OR_OFFICE_NUMBER,
        IS_SOCIETY_FORMED: req.body.IS_SOCIETY_FORMED ? '1' : '0',
        TENTETIVE_POSSESSION_DATE: req.body.TENTETIVE_POSSESSION_DATE,
        AGREEMENT_VALUE: req.body.AGREEMENT_VALUE ? req.body.AGREEMENT_VALUE : 0,
        PROPERY_VALUE: req.body.PROPERY_VALUE ? req.body.PROPERY_VALUE : 0,
        PER_SQ_FEET_RATE: req.body.PER_SQ_FEET_RATE ? req.body.PER_SQ_FEET_RATE : 0,
        IS_DONE_AGREEMENT: req.body.IS_DONE_AGREEMENT ? '1' : '0',
        OWNER_NAME: req.body.OWNER_NAME,
        IS_PAID_GOVERNMENT_DUES: req.body.IS_PAID_GOVERNMENT_DUES ? '1' : '0',
        IS_ANY_EXISTING_LOAN: req.body.IS_ANY_EXISTING_LOAN ? '1' : '0',

        CLIENT_ID: req.body.CLIENT_ID,
        IS_VALUATION_DONE: req.body.IS_VALUATION_DONE ? '1' : '0',
        IS_PAID_ADVANCE_AMOUNT: req.body.IS_PAID_ADVANCE_AMOUNT ? '1' : '0',
        VALUATOR_NAME: req.body.VALUATOR_NAME,
        VALUATION_DATE: req.body.VALUATION_DATE,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT,
    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('PURPOSE_OF_LOAN', ' parameter missing').exists(), body('TYPE_OF_PROPERTY').optional(), body('ADDRESS_ID').isInt().optional(), body('ADVANCE_PAYMENT').isDecimal().optional(), body('CARPET_AREA').optional(), body('SELLABLE_AREA').optional(), body('BOOKED_SHOP_OR_OFFICE_NUMBER').isInt().optional(), body('TENTETIVE_POSSESSION_DATE').optional(), body('AGREEMENT_VALUE').isDecimal().optional(), body('PROPERY_VALUE').isDecimal().optional(), body('PER_SQ_FEET_RATE').isDecimal().optional(), body('OWNER_NAME').optional(), body('ID').optional(),

        body('IS_SOCIETY_FORMED').optional().toInt().isInt(),
        body('IS_DONE_AGREEMENT').optional().toInt().isInt(),
        body('IS_PAID_GOVERNMENT_DUES').optional().toInt().isInt(),
        body('IS_ANY_EXISTING_LOAN').optional().toInt().isInt(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewRealEstateComercialLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get realEstateComercialLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewRealEstateComercialLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get realEstateComercialLoan information."
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
            mm.executeQueryData('INSERT INTO ' + realEstateComercialLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save realEstateComercialLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RealEstateComercialLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + realEstateComercialLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update realEstateComercialLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RealEstateComercialLoan information updated successfully...",
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
