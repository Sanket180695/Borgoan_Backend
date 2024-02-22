const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var factoryUnitInformation = "factory_unit_information";
var viewFactoryUnitInformation = "view_" + factoryUnitInformation;


function reqData(req) {

    var data = {
        FIRM_INFORMATION_ID: req.body.FIRM_INFORMATION_ID,
        EXISTING_LAND_AREA: req.body.EXISTING_LAND_AREA,
        EXISTING_CONSTRUCTION_AREA: req.body.EXISTING_CONSTRUCTION_AREA,
        PROPOSED_LAND_AREA: req.body.PROPOSED_LAND_AREA,
        PROPOSED_CONSTRUCTION_AREA: req.body.PROPOSED_CONSTRUCTION_AREA,
        TYPE_OF_FACTORY: req.body.TYPE_OF_FACTORY,
        IS_SUFFICIENT_AREA: req.body.IS_SUFFICIENT_AREA ? '1' : '0',
        IS_AVAILABILITY_OF_ELECTRICITY: req.body.IS_AVAILABILITY_OF_ELECTRICITY ? '1' : '0',
        IS_AVAILABILITY_OF_WATER: req.body.IS_AVAILABILITY_OF_WATER ? '1' : '0',
        IS_AVAILABILITY_OF_TRANSPORT: req.body.IS_AVAILABILITY_OF_TRANSPORT ? '1' : '0',
        IS_AVAILABILITY_OF_WORKERS: req.body.IS_AVAILABILITY_OF_WORKERS ? '1' : '0',
        BUSINESS_FIRM_INFORMATION_ID: req.body.BUSINESS_FIRM_INFORMATION_ID,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('FIRM_INFORMATION_ID').isInt().optional(),
        body('EXISTING_LAND_AREA').optional(),
        body('EXISTING_CONSTRUCTION_AREA').optional(),
        body('PROPOSED_LAND_AREA').optional(),
        body('PROPOSED_CONSTRUCTION_AREA').optional(),
        body('TYPE_OF_FACTORY').optional(),
        body('IS_SUFFICIENT_AREA').optional().toInt().isInt(),
        body('IS_AVAILABILITY_OF_ELECTRICITY').optional().toInt().isInt(),
        body('IS_AVAILABILITY_OF_WATER').optional().toInt().isInt(),
        body('IS_AVAILABILITY_OF_TRANSPORT').optional().toInt().isInt(),
        body('IS_AVAILABILITY_OF_WORKERS').optional().toInt().isInt(),
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
        mm.executeQuery('select count(*) as cnt from ' + viewFactoryUnitInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get factoryUnitInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewFactoryUnitInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get factoryUnitInformation information."
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
            mm.executeQueryData('INSERT INTO ' + factoryUnitInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save factoryUnitInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "FactoryUnitInformation information saved successfully...",
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
    console.log("FACTORY 1", req.body);
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
            mm.executeQueryData(`UPDATE ` + factoryUnitInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update factoryUnitInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "FactoryUnitInformation information updated successfully...",
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