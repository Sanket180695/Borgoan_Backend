const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var propertyInformation = "property_information";
var viewPropertyInformation = "view_" + propertyInformation;



function reqData(req) {

    var data = {


        PROPOSAL_ID: req.body.PROPOSAL_ID,
        INCOME_INFO_REF_ID: req.body.INCOME_INFO_REF_ID,
        MOVABLE_TYPE: req.body.MOVABLE_TYPE,
        IS_MACHINERY_OR_OTHER: req.body.IS_MACHINERY_OR_OTHER,
        IS_AGRICULTURE_LAND_OR_OTHER: req.body.IS_AGRICULTURE_LAND_OR_OTHER,
        TOTAL_AREA: req.body.TOTAL_AREA,
        AREA_UNIT: req.body.AREA_UNIT,
        ADDRESS_ID: req.body.ADDRESS_ID,
        BUILDUP_AREA: req.body.BUILDUP_AREA,
        PROPERTY_DETAILS: req.body.PROPERTY_DETAILS,
        IS_VALUATION_DONE: req.body.IS_VALUATION_DONE ? '1' : '0',
        VALUATOR_NAME: req.body.VALUATOR_NAME,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT,
        VALUATION_DATE: req.body.VALUATION_DATE,
        IS_MORTGAGED: req.body.IS_MORTGAGED ? '1' : '0',
        CLIENT_ID: req.body.CLIENT_ID,
        OWNER_NAME: req.body.OWNER_NAME,
        IS_MORTGAGED_FOR_SUB: req.body.IS_MORTGAGED_FOR_SUB ? '1' : '0',
        BANK_INSTITUTION_NAME: req.body.BANK_INSTITUTION_NAME ? req.body.BANK_INSTITUTION_NAME : '',
        LOAN_OUTSTANDING_AMOUNT: req.body.LOAN_OUTSTANDING_AMOUNT ? req.body.LOAN_OUTSTANDING_AMOUNT : 0,
        TYPE: req.body.TYPE,
        APPLICANT_ID: req.body.APPLICANT_ID,
      	AKAR_RS: req.body.AKAR_RS,
        REMARK: req.body.REMARK,
		MORTGUAGE_DETAILS:req.body.MORTGUAGE_DETAILS,
		EAST: req.body.EAST,
        WEST: req.body.WEST,
        NORTH: req.body.NORTH,
        SOUTH: req.body.SOUTH,
        CATEGORY_OF_SOIL: req.body.CATEGORY_OF_SOIL,
        OUT_OF_WHICH: req.body.OUT_OF_WHICH,
        POLICY_NO: req.body.POLICY_NO,
        INSURANCE_NO: req.body.INSURANCE_NO,
        CHESIS_NO: req.body.CHESIS_NO,
        ENGINE_NO: req.body.ENGINE_NO,
        MODEL_NO: req.body.MODEL_NO,
        VEHICLE_NO: req.body.VEHICLE_NO,
        INSURANCE_EXPIRY_DATE: req.body.INSURANCE_EXPIRY_DATE,
        VEHICLE_NAME: req.body.VEHICLE_NAME,
        WHEELS_COUNT: req.body.WHEELS_COUNT,
        DATE_OF_VERIFICATION: req.body.DATE_OF_VERIFICATION,
        NAME_OF_VERIFYING_OFFICER: req.body.NAME_OF_VERIFYING_OFFICER,
		VEHICLE_TYPE: req.body.VEHICLE_TYPE,
        ARCHIVE_FLAG : req.body.ARCHIVE_FLAG,
       
		
		
        DETAILS_OF_DOCUMENT_CONFORMING_RIGHT: req.body.DETAILS_OF_DOCUMENT_CONFORMING_RIGHT ? '1' : '0',
        ENCUMBRANCE: req.body.ENCUMBRANCE,
        MORTGAGE_TYPE: req.body.MORTGAGE_TYPE,
        ACRE: req.body.ACRE? req.body.ACRE : 0,
        GUNTE: req.body.GUNTE? req.body.GUNTE : 0,
        AANE: req.body.AANE? req.body.AANE : 0,
        OUT_OF_ACRE: req.body.OUT_OF_ACRE? req.body.OUT_OF_ACRE : 0,
        OUT_OF_GUNTE: req.body.OUT_OF_GUNTE? req.body.OUT_OF_GUNTE : 0,
        OUT_OF_AANE: req.body.OUT_OF_AANE? req.body.OUT_OF_AANE : 0,
    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('INCOME_INFO_REF_ID', ' parameter missing').optional(),
        body('MOVABLE_TYPE').optional(),
        //body('IS_MACHINERY_OR_OTHER').optional().toInt().isInt(),
        //body('IS_AGRICULTURE_LAND_OR_OTHER').optional().toInt().isInt(),
        body('TYPE_OF_PROPERTY').optional(),
        body('TOTAL_AREA').optional(),
        body('AREA_UNIT').optional(),
        body('BUILDUP_AREA').optional(),
        body('PROPERTY_DETAILS').optional(),
        body('IS_VALUATION_DONE').optional().toInt().isInt(),
        body('VALUATOR_NAME').optional(),
        body('VALUATION_AMOUNT').optional(),
        body('VALUATION_DATE').optional(),
        body('IS_MORTGAGED').optional().toInt().isInt(),
        body('IS_MORTGAGED_FOR_SUB').optional().toInt().isInt(),
        body('ID').optional(),
        body('ARCHIVE_FLAG').optional()
       
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
        mm.executeQuery('select count(*) as cnt from ' + viewPropertyInformation + ' where '+ `ARCHIVE_FLAG = 'F' `  + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get propertyInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewPropertyInformation + ' where ' + `ARCHIVE_FLAG = 'F'` + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get propertyInformation information."
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
            "message": errors
        });
    }
    else {
        try {
            mm.executeQueryData('INSERT INTO ' + propertyInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save propertyInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "PropertyInformation information saved successfully...",
                        "data": [{ ID: results.insertId }]
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
            "message": errors
        });
    }
    else {
        try {
            mm.executeQueryData(`UPDATE ` + propertyInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update propertyInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "PropertyInformation information updated successfully...",
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


exports.getPropertyInfo = (req, res) => {
    try {


        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportkey'];
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0;

        if (PROPOSAL_ID) {
            var query = `SET SESSION group_concat_max_len = 4294967290;
            SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('MORTGUAGE_DETAILS',MORTGUAGE_DETAILS,'AKAR_RS',AKAR_RS,'REMARK',REMARK,'ID',ID,'PROPOSAL_ID',PROPOSAL_ID,'OWNER_NAME',OWNER_NAME,'INCOME_INFO_REF_ID',INCOME_INFO_REF_ID,'MOVABLE_TYPE',MOVABLE_TYPE,'IS_MACHINERY_OR_OTHER',IS_MACHINERY_OR_OTHER,'IS_AGRICULTURE_LAND_OR_OTHER',IS_AGRICULTURE_LAND_OR_OTHER,'TOTAL_AREA',TOTAL_AREA,'AREA_UNIT',AREA_UNIT,'ADDRESS_ID',ADDRESS_ID,'BUILDUP_AREA',BUILDUP_AREA,'PROPERTY_DETAILS',PROPERTY_DETAILS,'IS_VALUATION_DONE',IS_VALUATION_DONE,'VALUATOR_NAME',VALUATOR_NAME,'VALUATION_AMOUNT',VALUATION_AMOUNT,'VALUATION_DATE',VALUATION_DATE,'IS_MORTGAGED',IS_MORTGAGED,'IS_MORTGAGED_FOR_SUB',IS_MORTGAGED_FOR_SUB,'BANK_INSTITUTION_NAME',BANK_INSTITUTION_NAME,'LOAN_OUTSTANDING_AMOUNT',LOAN_OUTSTANDING_AMOUNT,'CLIENT_ID',CLIENT_ID,'ADDRESS',ADDRESS)),']'),'"[','['),']"',']') as data1 FROM view_property_information m where PROPOSAL_ID = ${PROPOSAL_ID} AND TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``);




            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get all property information."
                    });
                }
                else {
                    console.log(results);
                    var json = results[1][0].data1
                    if (json)
                        json = json.replace(/\\/g, '');


                    console.log(json);
                    res.send({
                        code: 200,
                        message: "success",
                        data: json ? JSON.parse(json) : []
                    })
                }
            })
        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter Missing - ProposalId"
            });

        }

    } catch (error) {
        console.log(error)
    }
}



exports.updateManually = (req, res) => {
    try {

        var EXTRA_INFORMATION_ID = req.body.EXTRA_INFORMATION_ID;
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportKey']
        var TYPE = req.body.TYPE ? req.body.TYPE : 'B';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0;

        if (PROPOSAL_ID && EXTRA_INFORMATION_ID) {
            mm.executeQuery(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${PROPOSAL_ID} AND EXTRA_INFORMATION_ID =  ${EXTRA_INFORMATION_ID} AND TYPE ='${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID= ${APPLICANT_ID}` : ``), supportKey, (error, resultsUpdate) => {
                if (error) {
                    //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update Applicant Extra Information."
                    });
                }
                else {

                    res.send({
                        "code": 200,
                        "message": "Applicant Extra updated successfully...",
                    });

                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "parameter missing -proposalId,extraInformationId ",
            });
        }
    } catch (error) {
        console.log(error);
    }
}
