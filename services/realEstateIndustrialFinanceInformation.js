const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var realEstateIndustrialFinanceInformation = "real_estate_industrial_finance_information";
var viewRealEstateIndustrialFinanceInformation = "view_" + realEstateIndustrialFinanceInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        INDUSTRIAL_FINANCE_TYPE: req.body.INDUSTRIAL_FINANCE_TYPE,
        ADDRESS_ID: req.body.ADDRESS_ID,
        IS_LEASE_DEAD_MADE: req.body.IS_LEASE_DEAD_MADE ? '1' : '0',
        NAME_OF_LESSOR: req.body.NAME_OF_LESSOR,
        IS_AVALABLE_PLOT_ALLOTEMENT_LETTER: req.body.IS_AVALABLE_PLOT_ALLOTEMENT_LETTER ? '1' : '0',
        IS_AVAILABLE_POSSESSION_LETTER: req.body.IS_AVAILABLE_POSSESSION_LETTER ? '1' : '0',
        PLOT_AREA: req.body.PLOT_AREA,
        IS_PAID_STATUTORY_DUTY: req.body.IS_PAID_STATUTORY_DUTY ? '1' : '0',
        APPROXIMATE_VALUATION_OF_PLOT: req.body.APPROXIMATE_VALUATION_OF_PLOT ? req.body.APPROXIMATE_VALUATION_OF_PLOT : 0,
        IS_PLAN_READY_FOR_CONSTRUCTION: req.body.IS_PLAN_READY_FOR_CONSTRUCTION ? '1' : '0',
        IS_PERMISSION_TAKEN: req.body.IS_PERMISSION_TAKEN ? '1' : '0',
        IS_NOC_OBTAINED: req.body.IS_NOC_OBTAINED ? '1' : '0',
        NAME_OF_BUILDER_DEVELOPER: req.body.NAME_OF_BUILDER_DEVELOPER,
        TOTAL_AREA_OF_CONSTRUCTION: req.body.TOTAL_AREA_OF_CONSTRUCTION,
        TOTAL_COST_OF_CONSTRUCTION: req.body.TOTAL_COST_OF_CONSTRUCTION ? req.body.TOTAL_COST_OF_CONSTRUCTION : 0,
        EXPECTED_COMPLETION_TIME: req.body.EXPECTED_COMPLETION_TIME,
        IS_MIDC_READY_FOR_TRIPARTY_AGREEMENT: req.body.IS_MIDC_READY_FOR_TRIPARTY_AGREEMENT ? '1' : '0',
        IS_PLOT_RENTED_OR_OWN: req.body.IS_PLOT_RENTED_OR_OWN,
        IS_PLOT_NA_OR_NA_ORDERED: req.body.IS_PLOT_NA_OR_NA_ORDERED,
        IS_PAID_GOVERNMENT_DUTIES: req.body.IS_PAID_GOVERNMENT_DUTIES ? '1' : '0',
        NAME_OF_OWNER: req.body.NAME_OF_OWNER,
        CLIENT_ID: req.body.CLIENT_ID,
        IS_PLOT_TAKEN_ON_LEASE: req.body.IS_PLOT_TAKEN_ON_LEASE ? '1' : '0',
        IS_VALUATION_DONE: req.body.IS_VALUATION_DONE ? '1' : '0',
        VALUATOR_NAME: req.body.VALUATOR_NAME,
        VALUATION_DATE: req.body.VALUATION_DATE,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT ? req.body.VALUATION_AMOUNT : '0',

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('INDUSTRIAL_FINANCE_TYPE', ' parameter missing').exists(), body('ADDRESS_ID').isInt(), body('NAME_OF_LESSOR').optional(), body('PLOT_AREA').optional(), body('APPROXIMATE_VALUATION_OF_PLOT').isDecimal(), body('NAME_OF_BUILDER_DEVELOPER').optional(), body('TOTAL_AREA_OF_CONSTRUCTION').isInt().optional(), body('TOTAL_COST_OF_CONSTRUCTION').isDecimal().optional(), body('EXPECTED_COMPLETION_TIME').isInt().optional(), body('IS_PLOT_RENTED_OR_OWN').optional(), body('IS_PLOT_NA_OR_NA_ORDERED').optional(), body('NAME_OF_OWNER').optional(), body('ID').optional(),


        body('IS_LEASE_DEAD_MADE').optional().toInt().isInt(),
        body('IS_AVALABLE_PLOT_ALLOTEMENT_LETTER').optional().toInt().isInt(),
        body('IS_AVAILABLE_POSSESSION_LETTER').optional().toInt().isInt(),
        body('IS_PAID_STATUTORY_DUTY').optional().toInt().isInt(),
        body('IS_PLAN_READY_FOR_CONSTRUCTION').optional().toInt().isInt(),
        body('IS_PERMISSION_TAKEN').optional().toInt().isInt(),
        body('IS_NOC_OBTAINED').optional().toInt().isInt(),
        body('IS_MIDC_READY_FOR_TRIPARTY_AGREEMENT').optional().toInt().isInt(),
        body('IS_PAID_GOVERNMENT_DUTIES').optional().toInt().isInt(),
        body('IS_PLOT_TAKEN_ON_LEASE').optional().toInt().isInt(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewRealEstateIndustrialFinanceInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get realEstateIndustrialFinanceInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewRealEstateIndustrialFinanceInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get realEstateIndustrialFinanceInformation information."
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
            mm.executeQueryData('INSERT INTO ' + realEstateIndustrialFinanceInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save realEstateIndustrialFinanceInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RealEstateIndustrialFinanceInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + realEstateIndustrialFinanceInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update realEstateIndustrialFinanceInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "RealEstateIndustrialFinanceInformation information updated successfully...",
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