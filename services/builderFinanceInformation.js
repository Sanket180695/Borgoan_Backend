const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var builderFinanceInformation = "builder_finance_information";
var viewBuilderFinanceInformation = "view_" + builderFinanceInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        NAME_OF_PROJECT: req.body.NAME_OF_PROJECT,
        ADDRESS_ID: req.body.ADDRESS_ID,
        NAME_OF_OWNER: req.body.NAME_OF_OWNER,
        PROPERTY_BELONGS_TO: req.body.PROPERTY_BELONGS_TO,
        PROJECT_TYPE: req.body.PROJECT_TYPE,
        IS_REGISTERED_UNDER_RERA: req.body.IS_REGISTERED_UNDER_RERA ? '1' : '0',
        AREA_OF_PLOT: req.body.AREA_OF_PLOT,
        PLOT_VALUATION: req.body.PLOT_VALUATION ? req.body.PLOT_VALUATION : 0,
        IS_PLOT_NA_OR_NA_ORDERED: req.body.IS_PLOT_NA_OR_NA_ORDERED ,
        IS_PAID_GOVERNMENT_DUES: req.body.IS_PAID_GOVERNMENT_DUES ? '1' : '0',
        IS_READY_CONSTRUCTION_PLAN: req.body.IS_READY_CONSTRUCTION_PLAN ? '1' : '0',
        IS_PERMISSION_OBTAINED: req.body.IS_PERMISSION_OBTAINED ? '1' : '0',
        TOTAL_AREA_OF_CONSTRUCTION: req.body.TOTAL_AREA_OF_CONSTRUCTION,
        TOTAL_COST_OF_CONSTRUCTION: req.body.TOTAL_COST_OF_CONSTRUCTION,
        EXPECTED_COMPLETION_TIME: req.body.EXPECTED_COMPLETION_TIME,
        IS_PROJECT_WORK_STARTED: req.body.IS_PROJECT_WORK_STARTED ? '1' : '0',
        TOTAL_COST_OF_WORK_IN_PROGRESS: req.body.TOTAL_COST_OF_WORK_IN_PROGRESS ? req.body.TOTAL_COST_OF_WORK_IN_PROGRESS : 0,
        IS_TAKEN_UNSECURED_LOAN: req.body.IS_TAKEN_UNSECURED_LOAN ? '1' : '0',
        IS_ANY_FINANCER_INVESTED: req.body.IS_ANY_FINANCER_INVESTED ? '1' : '0',
        FLATS_COUNT: req.body.FLATS_COUNT,
        NUMBER_OF_FLATS_GIVEN_TO_OWNER: req.body.NUMBER_OF_FLATS_GIVEN_TO_OWNER,
        TOTAL_SELLEBLE_AREA_GIVEN_TO_OWNER_FLATS: req.body.TOTAL_SELLEBLE_AREA_GIVEN_TO_OWNER_FLATS,
        NUMBER_OF_SHOPS_OFFICES_GIVEN_TO_OWNER: req.body.NUMBER_OF_SHOPS_OFFICES_GIVEN_TO_OWNER,
        TOTAL_SELLEBLE_AREA_GIVEN_TO_OWNER_SHOPS_OFFICES: req.body.TOTAL_SELLEBLE_AREA_GIVEN_TO_OWNER_SHOPS_OFFICES,
        OTHER_TOTAL_SELLABLE_AREA: req.body.OTHER_TOTAL_SELLABLE_AREA,
        SELLING_RATE_FLATS: req.body.SELLING_RATE_FLATS ? req.body.SELLING_RATE_FLATS : 0,
        TOTAL_OTHER_FLATS_SELLING_RATE: req.body.TOTAL_OTHER_FLATS_SELLING_RATE ? req.body.TOTAL_OTHER_FLATS_SELLING_RATE : 0,
        NUMBER_OF_COMMERCIAL_PLACES: req.body.NUMBER_OF_COMMERCIAL_PLACES,
        TOTAL_AREA_OF_OTHER_COMMERCIAL_PLACES: req.body.TOTAL_AREA_OF_OTHER_COMMERCIAL_PLACES,
        SELLING_RATE_COMMERCIAL_OFFICES: req.body.SELLING_RATE_COMMERCIAL_OFFICES ? req.body.SELLING_RATE_COMMERCIAL_OFFICES : 0,
        TOTAL_SELLING_PRICE_OF_COMMERCIAL_OFFICES: req.body.TOTAL_SELLING_PRICE_OF_COMMERCIAL_OFFICES ? req.body.TOTAL_SELLING_PRICE_OF_COMMERCIAL_OFFICES : 0,
        TOTAL_SELL_PRICE_OTHER: req.body.TOTAL_SELL_PRICE_OTHER ? req.body.TOTAL_SELL_PRICE_OTHER : 0,
        IS_STARTED_BOOKING: req.body.IS_STARTED_BOOKING ? '1' : '0',
        COLLECTED_AMOUNT: req.body.COLLECTED_AMOUNT ? req.body.COLLECTED_AMOUNT : 0,
        SALE_DEEDS_EXECUTED_COUNT: req.body.SALE_DEEDS_EXECUTED_COUNT,

        CLIENT_ID: req.body.CLIENT_ID,
        RERA_REGISTRATION_NUMBER: req.body.RERA_REGISTRATION_NUMBER,
        REMAINING_LOAN_AMOUNT: req.body.REMAINING_LOAN_AMOUNT ? req.body.REMAINING_LOAN_AMOUNT : 0,

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('NAME_OF_PROJECT', ' parameter missing').exists(), body('ADDRESS_ID').isInt(), body('NAME_OF_OWNER').optional(), body('PROPERTY_BELONGS_TO').optional(), body('PROJECT_TYPE').optional(), body('AREA_OF_PLOT').isInt().optional(), body('PLOT_VALUATION').isDecimal().optional(), body('IS_PLOT_NA_OR_NA_ORDERED').optional(), body('TOTAL_AREA_OF_CONSTRUCTION').isInt().optional(), body('TOTAL_COST_OF_CONSTRUCTION').isInt().optional(), body('EXPECTED_COMPLETION_TIME').isInt().optional(), body('TOTAL_COST_OF_WORK_IN_PROGRESS').isDecimal().optional(), body('FLATS_COUNT').isInt().optional(), body('NUMBER_OF_FLATS_GIVEN_TO_OWNER').isInt().optional(), body('TOTAL_SELLEBLE_AREA_GIVEN_TO_OWNER_FLATS').isInt().optional(), body('NUMBER_OF_SHOPS_OFFICES_GIVEN_TO_OWNER').isInt().optional(), body('TOTAL_SELLEBLE_AREA_GIVEN_TO_OWNER_SHOPS_OFFICES').isInt().optional(), body('OTHER_TOTAL_SELLABLE_AREA').isInt().optional(), body('SELLING_RATE_FLATS').isDecimal().optional(), body('TOTAL_OTHER_FLATS_SELLING_RATE').isDecimal().optional(), body('NUMBER_OF_COMMERCIAL_PLACES').isInt().optional(), body('TOTAL_AREA_OF_OTHER_COMMERCIAL_PLACES').isInt().optional(), body('SELLING_RATE_COMMERCIAL_OFFICES').isDecimal().optional(), body('TOTAL_SELLING_PRICE_OF_COMMERCIAL_OFFICES').isDecimal().optional(), body('TOTAL_SELL_PRICE_OTHER').isDecimal().optional(), body('COLLECTED_AMOUNT').isDecimal().optional(), body('SALE_DEEDS_EXECUTED_COUNT').isInt().optional(), body('ID').optional(),

       body('IS_REGISTERED_UNDER_RERA').optional().toInt().isInt(),
        body('IS_PAID_GOVERNMENT_DUES').optional().toInt().isInt(),
        body('IS_READY_CONSTRUCTION_PLAN').optional().toInt().isInt(),
        body('IS_PERMISSION_OBTAINED').optional().toInt().isInt(),
        body('IS_PROJECT_WORK_STARTED').optional().toInt().isInt(),
        body('IS_TAKEN_UNSECURED_LOAN').optional().toInt().isInt(),
        body('IS_ANY_FINANCER_INVESTED').optional().toInt().isInt(),
        body('IS_STARTED_BOOKING').optional().toInt().isInt(),
       


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
        mm.executeQuery('select count(*) as cnt from ' + viewBuilderFinanceInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get builderFinanceInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewBuilderFinanceInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get builderFinanceInformation information."
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
            mm.executeQueryData('INSERT INTO ' + builderFinanceInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save builderFinanceInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "BuilderFinanceInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + builderFinanceInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update builderFinanceInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "BuilderFinanceInformation information updated successfully...",
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