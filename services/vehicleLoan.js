const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var vehicleLoan = "vehicle_loan";
var viewVehicleLoan = "view_" + vehicleLoan;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        NAME_OF_VEHICLE: req.body.NAME_OF_VEHICLE,
        WHEELS_COUNT: req.body.WHEELS_COUNT,
        VEHICLE_COMPANY: req.body.VEHICLE_COMPANY,
        USE_TYPE: req.body.USE_TYPE,
        IS_BS6: req.body.IS_BS6 ? '1' : '0',
        INSURANCE_TYPE: req.body.INSURANCE_TYPE,
        COMPREHENSIVE_INSURANCE_PERIOD: req.body.COMPREHENSIVE_INSURANCE_PERIOD,
        THIRD_PARTY_INSURANCE_PERIOD: req.body.THIRD_PARTY_INSURANCE_PERIOD,
        VEHICLE_TYPE: req.body.VEHICLE_TYPE,
        DEALER_NAME: req.body.DEALER_NAME,
        BASIC_PRICE: req.body.BASIC_PRICE ? req.body.BASIC_PRICE : '0',
        ACCESSORIES_PRICE: req.body.ACCESSORIES_PRICE ? req.body.ACCESSORIES_PRICE : '0',
        RTO_TAX_OR_REGISTRATION_PRICE: req.body.RTO_TAX_OR_REGISTRATION_PRICE ? req.body.RTO_TAX_OR_REGISTRATION_PRICE : '0',
        INSURENCE: req.body.INSURENCE ? req.body.INSURENCE : '0',
        OTHER_CHARGES: req.body.OTHER_CHARGES ? req.body.OTHER_CHARGES : '0',
        OTHER_PRICE1: req.body.OTHER_PRICE1 ? req.body.OTHER_PRICE1 : '0',
        OTHER_PRICE2: req.body.OTHER_PRICE2 ? req.body.OTHER_PRICE2 : '0',
        QUOTATION_GIVEN_DATE: req.body.QUOTATION_GIVEN_DATE,
        PREVIOUS_OWNER_NAME: req.body.PREVIOUS_OWNER_NAME ? req.body.PREVIOUS_OWNER_NAME : '',
        NUMBER_OF_OWNERSHIPS: req.body.NUMBER_OF_OWNERSHIPS ? req.body.NUMBER_OF_OWNERSHIPS : 0,
        VEHICLE_VALUATION: req.body.VEHICLE_VALUATION,
        YEAR_OF_PURCHASE: req.body.YEAR_OF_PURCHASE ? req.body.YEAR_OF_PURCHASE : '',
        PURCHASE_AMOUNT: req.body.PURCHASE_AMOUNT ? req.body.PURCHASE_AMOUNT : 0,
        IS_ADVANCE_PAID: req.body.IS_ADVANCE_PAID ? '1' : '0',
        ADVANCE_PAID_AMOUNT: req.body.ADVANCE_PAID_AMOUNT ? req.body.ADVANCE_PAID_AMOUNT : 0,
        CLIENT_ID: req.body.CLIENT_ID,
        MAKE_YEAR: req.body.MAKE_YEAR,

        IS_VALUATION_DONE: req.body.IS_VALUATION_DONE ? '1' : '0',
        VALUATOR_NAME: req.body.VALUATOR_NAME,
        VALUATION_DATE: req.body.VALUATION_DATE,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT ? req.body.VALUATION_AMOUNT : 0,
        IS_DONE_AGREEMENT: req.body.IS_DONE_AGREEMENT ? '1' : '0',
		REGISTRATION: req.body.REGISTRATION,
		FITNESS_PERIOD: req.body.FITNESS_PERIOD,
		TAX_PERIOD: req.body.TAX_PERIOD,	

    }
    return data;
}




exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('NAME_OF_VEHICLE').optional(),
        body('WHEELS_COUNT').optional(),
        body('VEHICLE_COMPANY').optional(),
        body('USE_TYPE').optional(),
        body('INSURANCE_TYPE').optional(),
        body('COMPREHENSIVE_INSURANCE_PERIOD').optional(),
        body('THIRD_PARTY_INSURANCE_PERIOD').optional(),
        body('VEHICLE_TYPE').optional(),
        body('DEALER_NAME').optional(),
        body('QUOTATION_AMOUNT').isDecimal().optional(),
        body('QUOTATION_GIVEN_DATE').optional(),
        body('PREVIOUS_OWNER_NAME').optional(),
        body('PREVIOUS_OWNER_MOBILE_NUMBER').isInt().optional(),
        body('VEHICLE_VALUATION').optional(),
        body('YEAR_OF_PURCHASE').optional(),
        body('PURCHASE_AMOUNT').isDecimal().optional(),
        body('ADVANCE_PAID_AMOUNT').isDecimal().optional(),
        body('ID').optional(),
        body('IS_BS6').optional().toInt().isInt(),
        body('IS_ADVANCE_PAID').optional().toInt().isInt(),
    	body('IS_VALUATION_DONE').optional().toInt().isInt(),
	body('IS_DONE_AGREEMENT').optional().toInt().isInt(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewVehicleLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get vehicleLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewVehicleLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get vehicleLoan information."
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
            mm.executeQueryData('INSERT INTO ' + vehicleLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save vehicleLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "VehicleLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + vehicleLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update vehicleLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "VehicleLoan information updated successfully...",
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