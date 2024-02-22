const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var managementOfSalesInformation = "management_of_sales_information";
var viewManagementOfSalesInformation = "view_" + managementOfSalesInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        AGENT_NAME: req.body.AGENT_NAME,
        IS_SHOWROOM_OR_DEPO_OWNED: req.body.IS_SHOWROOM_OR_DEPO_OWNED ? '1' : '0',
        SHOWROOM_OR_DEPO_ADDRESS_ID: req.body.SHOWROOM_OR_DEPO_ADDRESS_ID,
        IS_SALE_DIRECT_TO_CUSTOMER: req.body.IS_SALE_DIRECT_TO_CUSTOMER ? '1' : '0',
        CUSTOMER_DETAILS: req.body.CUSTOMER_DETAILS,
        IS_EXPORT_SALES: req.body.IS_EXPORT_SALES ? '1' : '0',
        EXPORT_DETAILS: req.body.EXPORT_DETAILS,
        BUSINESS_FIRM_INFORMATION_ID: req.body.BUSINESS_FIRM_INFORMATION_ID ? req.body.BUSINESS_FIRM_INFORMATION_ID : 0,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROJECTIONS_INFORMATION_ID').isInt().optional(),
        body('AGENT_NAME').optional(),
        body('SHOWROOM_OR_DEPO_ADDRESS_ID').isInt().toInt().optional(),
        body('IS_SHOWROOM_OR_DEPO_OWNED').toInt().isInt().optional(),
        body('IS_SALE_DIRECT_TO_CUSTOMER').toInt().isInt().optional(),
        body('IS_EXPORT_SALES').toInt().isInt().optional(),
        body('CUSTOMER_DETAILS').optional(),
        body('EXPORT_DETAILS').optional(),
        body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewManagementOfSalesInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get managementOfSalesInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewManagementOfSalesInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get managementOfSalesInformation information."
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
            mm.executeQueryData('INSERT INTO ' + managementOfSalesInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save managementOfSalesInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ManagementOfSalesInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + managementOfSalesInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update managementOfSalesInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ManagementOfSalesInformation information updated successfully...",
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




exports.getManagementOfSalesInfo = (req, res) => {
    try {

        var PROPOSAL_ID = req.body.PROPOSAL_ID ? req.body.PROPOSAL_ID : 0;
        var BUSINESS_FIRM_INFORMATION_ID = req.body.BUSINESS_FIRM_INFORMATION_ID ? req.body.BUSINESS_FIRM_INFORMATION_ID : 0;
        var supportKey = req.headers['supportkey'];


        if (PROPOSAL_ID || BUSINESS_FIRM_INFORMATION_ID) {
            var query = `SET SESSION group_concat_max_len = 4294967290;
            SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'PROPOSAL_ID',PROPOSAL_ID,'AGENT_NAME',AGENT_NAME,'IS_SHOWROOM_OR_DEPO_OWNED',IS_SHOWROOM_OR_DEPO_OWNED,'SHOWROOM_OR_DEPO_ADDRESS_ID',SHOWROOM_OR_DEPO_ADDRESS_ID,'IS_SALE_DIRECT_TO_CUSTOMER',IS_SALE_DIRECT_TO_CUSTOMER,'CUSTOMER_DETAILS',CUSTOMER_DETAILS,'IS_EXPORT_SALES',IS_EXPORT_SALES,'EXPORT_DETAILS',EXPORT_DETAILS,'CLIENT_ID',CLIENT_ID,'BUSINESS_FIRM_INFORMATION_ID',BUSINESS_FIRM_INFORMATION_ID,'ADDRESS',IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_address_information where ID = M.SHOWROOM_OR_DEPO_ADDRESS_ID ),'[]'))),']'),'"[','['),']"',']') as data FROM view_management_of_sales_information M where `+ (PROPOSAL_ID ? ` PROPOSAL_ID = ${PROPOSAL_ID}` : ` BUSINESS_FIRM_INFORMATION_ID = ${BUSINESS_FIRM_INFORMATION_ID}`);


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
                    var json = results[1][0].data;
                    if (json)
                        json = json.replace(/\\/g, '');
                    console.log(json);
                    res.send({
                        code: 200,
                        message: "success",
                        data: (json ? JSON.parse(json) : [])
                    });
                }
            });
        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter Missing - ProposalId or businessfirmInfo"
            });

        }
    } catch (error) {
        console.log(error)
    }
}
