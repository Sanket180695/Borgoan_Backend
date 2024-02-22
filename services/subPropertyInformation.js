const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var subpropertyInformation = "sub_property_information";
var viewSubPropertyInformation = "view_" + subpropertyInformation;



function reqData(req) {

    var data = {

        PROPOSAL_ID: req.body.PROPOSAL_ID,
        IS_VALUATION_DONE: req.body.IS_VALUATION_DONE? '1' : '0',
        DATE_OF_VERIFICATION: req.body.DATE_OF_VERIFICATION,
        NAME_OF_VERIFYING_OFFICER: req.body.NAME_OF_VERIFYING_OFFICER,
        IS_RC_ENCLOSED: req.body.IS_RC_ENCLOSED? '1' : '0',
        COMBINED_UTARA: req.body.COMBINED_UTARA? '1' : '0',
        CULTIVATION_DETAILS: req.body.CULTIVATION_DETAILS? '1' : '0',
        VALUATION_1: req.body.VALUATION_1? '1' : '0',
        BOUNDARIES_1: req.body.BOUNDARIES_1? '1' : '0',
        NO_DUES:req.body.NO_DUES? '1' : '0',
        SKETCH_1: req.body.SKETCH_1? '1' : '0',
        ENCUMBRANCE_CERTIFICATE_1: req.body.ENCUMBRANCE_CERTIFICATE_1? '1' : '0',
        HOME_UTARA: req.body.HOME_UTARA? '1' : '0',
        VALUATION_2: req.body.VALUATION_2? '1' : '0',
        PHOTO: req.body.PHOTO? '1' : '0',
         PHOTO_1: req.body.PHOTO_1? '1' : '0',
        BOUNDARIES_2: req.body.BOUNDARIES_2? '1' : '0',
        SKETCH_2:req.body.SKETCH_2? '1' : '0',    
        ENCUMBRANCE_CERTIFICATE_2: req.body.ENCUMBRANCE_CERTIFICATE_2? '1' : '0',
        CLIENT_ID: req.body.CLIENT_ID,
       
    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('IS_VALUATION_DONE').optional().toInt().isInt(),        
        body('DATE_OF_VERIFICATION', ' parameter missing').optional(),
        body('NAME_OF_VERIFYING_OFFICER').optional(),
        body('IS_RC_ENCLOSED').optional().toInt().isInt(),

        body('COMBINED_UTARA').optional(),
        body('CULTIVATION_DETAILS').optional(),
        body('VALUATION_1').optional(),
        body('NO_DUES').optional(),
        body('BOUNDARIES_1').optional(),    
        body('NO_DUES').optional(),    
        body('SKETCH_1').optional(),    
        body('ENCUMBRANCE_CERTIFICATE_1').optional(),    
        body('HOME_UTARA').optional(),    
        body('VALUATION_2').optional(),   
        body('PHOTO').optional(),      
        body('BOUNDARIES_2').optional(),      
        body('SKETCH_2').optional(),       
        body('ENCUMBRANCE_CERTIFICATE_2').optional()               

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
        mm.executeQuery('select count(*) as cnt from ' + viewSubPropertyInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get subpropertyInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewSubPropertyInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get subpropertyInformation information."
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
            mm.executeQueryData('INSERT INTO ' + subpropertyInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save subpropertyInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "SubPropertyInformation information saved successfully...",
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
            "message": errors.errors
        });
    }
    else {
        try {
            mm.executeQueryData(`UPDATE ` + subpropertyInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
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
