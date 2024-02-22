const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var cashCreditAddressDetails = "cash_credit_address_details";
var viewCashCreditAddressDetails = "view_" + cashCreditAddressDetails;


function reqData(req) {

    var data = {
        CASH_CREDIT_INFORMATION_ID: req.body.CASH_CREDIT_INFORMATION_ID,
        ADDRESS_ID: req.body.ADDRESS_ID,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('CASH_CREDIT_INFORMATION_ID').isInt(), body('ADDRESS_ID').isInt(), body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewCashCreditAddressDetails + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get cashCreditAddressDetails count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewCashCreditAddressDetails + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get cashCreditAddressDetails information."
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
            mm.executeQueryData('INSERT INTO ' + cashCreditAddressDetails + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save cashCreditAddressDetails information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "CashCreditAddressDetails information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + cashCreditAddressDetails + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update cashCreditAddressDetails information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "CashCreditAddressDetails information updated successfully...",
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




exports.getAddress = (req, res) => {
    try {

        var CASH_CREDIT_INFORMATION_ID = req.body.CASH_CREDIT_INFORMATION_ID;
        var supportKey = req.headers['supportkey'];


        if (CASH_CREDIT_INFORMATION_ID) {
            var query = `SET SESSION group_concat_max_len = 4294967290;SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',a.ID,'CASH_CREDIT_INFORMATION_ID',a.CASH_CREDIT_INFORMATION_ID,'ADDRESS_ID',a.ADDRESS_ID,'ADDRESS',IFNULL((
        SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_address_information where ID = a.ADDRESS_ID),'[]'),
                      'ARCHIVE_FLAG',a.ARCHIVE_FLAG,'CLIENT_ID',a.CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_cash_credit_address_details a where CASH_CREDIT_INFORMATION_ID = ${CASH_CREDIT_INFORMATION_ID}`


            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get all cash credit address information."
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
                        data: json ? JSON.parse(json) : []
                    });
                }
            });
        } else {

            res.send({
                "code": 400,
                "message": "Parameter Missing - CASH_CREDIT_INFORMATION_ID"
            });

        }
    } catch (error) {
        console.log(error);
    }

}