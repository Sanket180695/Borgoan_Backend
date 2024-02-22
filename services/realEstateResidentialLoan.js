const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var realEstateResidentialLoan = "real_estate_residential_loan";
var viewRealEstateResidentialLoan = "view_" + realEstateResidentialLoan;


function reqData(req) {

    var data = {

        PROPOSAL_ID: req.body.PROPOSAL_ID,
        PURPOSE_OF_LOAN: req.body.PURPOSE_OF_LOAN,
        TYPE_OF_PROPERTY: req.body.TYPE_OF_PROPERTY,
        ADDRESS_ID: req.body.ADDRESS_ID,
        ADVANCE_PAYMENT: req.body.ADVANCE_PAYMENT ? req.body.ADVANCE_PAYMENT : 0,
        CARPET_AREA: req.body.CARPET_AREA,
        SELLABLE_AREA: req.body.SELLABLE_AREA,
        BOOKED_FLAT_NUMBER: req.body.BOOKED_FLAT_NUMBER,
        IS_SOCIETY_FORMED: req.body.IS_SOCIETY_FORMED ? '1' : '0',
        TENTETIVE_POSSESSION_DATE: req.body.TENTETIVE_POSSESSION_DATE,
        AGREEMENT_VALUE: req.body.AGREEMENT_VALUE ? req.body.AGREEMENT_VALUE : 0,
        PROPERY_VALUE: req.body.PROPERY_VALUE ? req.body.PROPERY_VALUE : 0,
        PER_SQ_FEET_RATE: req.body.PER_SQ_FEET_RATE ? req.body.PER_SQ_FEET_RATE : 0,
        IS_DONE_AGREEMENT: req.body.IS_DONE_AGREEMENT ? '1' : '0',
        OWNER_NAME: req.body.OWNER_NAME,
        IS_PAID_GOVERNMENT_DUES: req.body.IS_PAID_GOVERNMENT_DUES ? '1' : '0',
        IS_ANY_EXISTING_LOAN: req.body.IS_ANY_EXISTING_LOAN ? '1' : '0',
        PLOT_AREA: req.body.PLOT_AREA,
        IS_PLOT_NA_OR_NA_ORDERED: req.body.IS_PLOT_NA_OR_NA_ORDERED,
        IS_CONSTRUCTION_PLAN_READY: req.body.IS_CONSTRUCTION_PLAN_READY ? '1' : '0',
        IS_PERMISSION_OBTAINED: req.body.IS_PERMISSION_OBTAINED ? '1' : '0',
        TOTAL_CONSTRUCTION_AREA: req.body.TOTAL_CONSTRUCTION_AREA,
        TOTAL_CONSTRUCTION_COST: req.body.TOTAL_CONSTRUCTION_COST ? req.body.TOTAL_CONSTRUCTION_COST : 0,
        EXPECTED_COMPLETION_TIME: req.body.EXPECTED_COMPLETION_TIME,
        NATURE_OF_PROPERTY: req.body.NATURE_OF_PROPERTY,
        IS_TAKEN_ESTIMATION: req.body.IS_TAKEN_ESTIMATION ? '1' : '0',
        ESTIMATION_DETAILS: req.body.ESTIMATION_DETAILS,
        COST_OF_REPAIRY: req.body.COST_OF_REPAIRY ? req.body.COST_OF_REPAIRY : 0,
        TOTAL_AMOUNT_OF_DEBTS: req.body.TOTAL_AMOUNT_OF_DEBTS ? req.body.TOTAL_AMOUNT_OF_DEBTS : 0,
        IS_DEBT_AMOUNT_PAYABLE_TO_OTHER_BANK: req.body.IS_DEBT_AMOUNT_PAYABLE_TO_OTHER_BANK ? '1' : '0',
        NAME_OF_BUILDER_DEVELOPER: req.body.NAME_OF_BUILDER_DEVELOPER,
        CLIENT_ID: req.body.CLIENT_ID,
        IS_VALUATION_DONE: req.body.IS_VALUATION_DONE ? '1' : '0',
        VALUATOR_NAME: req.body.VALUATOR_NAME,
        VALUATION_DATE: req.body.VALUATION_DATE,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT?req.body.VALUATION_AMOUNT:'0',
        EXISTING_LOAN_AMOUNT: req.body.EXISTING_LOAN_AMOUNT,
        PLEDGED_TYPE: req.body.PLEDGED_TYPE,
        IS_PAID_ADVANCE_AMOUNT: req.body.IS_PAID_ADVANCE_AMOUNT ? '1' : '0',
	EAST: req.body.EAST,
	WEST: req.body.WEST,
	SOUTH: req.body.SOUTH,
	NORTH: req.body.NORTH,
AKAR_RS: req.body.AKAR_RS,
CONSTRUCTION_MATERIAL_DETAILS: req.body.CONSTRUCTION_MATERIAL_DETAILS,

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('PURPOSE_OF_LOAN', ' parameter missing').exists(), body('TYPE_OF_PROPERTY', ' parameter missing').exists(), body('ADDRESS_ID').isInt().optional(), body('ADVANCE_PAYMENT').isDecimal().optional(), body('CARPET_AREA').optional(), body('SELLABLE_AREA').optional(), body('BOOKED_FLAT_NUMBER').isInt().optional(), body('TENTETIVE_POSSESSION_DATE').optional(), body('AGREEMENT_VALUE').isDecimal().optional(), body('PROPERY_VALUE').isDecimal().optional(), body('PER_SQ_FEET_RATE').isDecimal().optional(), body('OWNER_NAME').optional(), body('PLOT_AREA').optional(), body('IS_PLOT_NA_OR_NA_ORDERED').optional(), body('TOTAL_CONSTRUCTION_AREA').optional(), body('TOTAL_CONSTRUCTION_COST').isDecimal().optional(), body('EXPECTED_COMPLETION_TIME').isInt().optional(), body('NATURE_OF_PROPERTY').optional(), body('ESTIMATION_DETAILS').optional(), body('COST_OF_REPAIRY').isDecimal().optional(), body('TOTAL_AMOUNT_OF_DEBTS').isDecimal().optional(), body('ID').optional(),

        body('IS_SOCIETY_FORMED').optional().toInt().isInt(),
        body('IS_DONE_AGREEMENT').optional().toInt().isInt(),
        body('IS_PAID_GOVERNMENT_DUES').optional().toInt().isInt(),
        body('IS_ANY_EXISTING_LOAN').optional().toInt().isInt(),
        body('IS_CONSTRUCTION_PLAN_READY').optional().toInt().isInt(),
        body('IS_PERMISSION_OBTAINED').optional().toInt().isInt(),
        body('IS_TAKEN_ESTIMATION').optional().toInt().isInt(),
        body('IS_DEBT_AMOUNT_PAYABLE_TO_OTHER_BANK').optional().toInt().isInt(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewRealEstateResidentialLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get realEstateResidentialLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewRealEstateResidentialLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get realEstateResidentialLoan information."
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
            mm.executeQueryData('INSERT INTO ' + realEstateResidentialLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save realEstateResidentialLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RealEstateResidentialLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + realEstateResidentialLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update realEstateResidentialLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RealEstateResidentialLoan information updated successfully...",
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
