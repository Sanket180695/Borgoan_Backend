const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var goldLoanData = "gold_loan_data";
var viewgoldLoanData = "view_" + goldLoanData;


function reqData(req) {

    var data = {

        PROPOSAL_ID: req.body.PROPOSAL_ID,
        DESCRIPTION_OF_JEWELS: req.body.DESCRIPTION_OF_JEWELS,
        TOTAL_QUANTITY: req.body.TOTAL_QUANTITY,
        GROSS_WEIGHT: req.body.GROSS_WEIGHT,
        NET_WEIGHT: req.body.NET_WEIGHT,
        PER_GRAM_RATE: req.body.PER_GRAM_RATE,
        VALUATION_AMOUNT: req.body.VALUATION_AMOUNT,
        LOAN_AMOUNT_IN_WORDSSS : req.body.LOAN_AMOUNT_IN_WORDSSS,
        REMARK: req.body.REMARK,
        ARCHIVE_FLAG: req.body.ARCHIVE_FLAG ? req.body.ARCHIVE_FLAG : 'F',
        PERSONAL_INFORMATION_ID : req.body.PERSONAL_INFORMATION_ID,
        total11: req.body.total11,
        total2: req.body.total2,
        total3: req.body.total3,
        HAND_WRITTEN_AMT_IN_WORDS3:req.body.HAND_WRITTEN_AMT_IN_WORDS3


    }
    return data;
}



exports.validate = function () {
    return [

        body('STATE').optional(),
        body('DISTRICT').optional(),
        body('TALUKA').optional(),
        body('VILLAGE').optional(),
        body('PINCODE').isInt().optional(),
        body('LANDMARK').optional(),
        body('BUILDING').optional(),
        body('HOUSE_NO').optional(),
        body('ID').optional()

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

    // let sortKey = req.body.sortKey ? req.body.sortKey : 'ID';
    // let sortValue = req.body.sortValue ? req.body.sortValue : 'DESC';
    // let filter = req.body.filter ? req.body.filter : '';

    // let criteria = '';

    // if (pageIndex === '' && pageSize === '')
    //     criteria = filter + " order by " + sortKey + " " + sortValue;
    // else
    //     criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;

    // let countCriteria = filter;
    var supportKey = req.headers['supportkey'];
    try {
        mm.executeQuery('select count(*) as cnt from ' + viewgoldLoanData + ' where 1 AND  PROPOSAL_ID= '+ req.body.PROPOSAL_ID + ` AND ARCHIVE_FLAG = 'F' `, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get familyDetails count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewgoldLoanData + ` where 1 AND  ARCHIVE_FLAG = 'F'` + ` AND PROPOSAL_ID = `+ req.body.PROPOSAL_ID , supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get familyDetail information."
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
            mm.executeQueryData('INSERT INTO ' + goldLoanData + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                  //  logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save familyDetail information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "FamilyDetail information saved successfully...",
                        "data": [{
                            ID: results.insertId
                        }]
                    });
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
           // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
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
       setData += `${key}= ? , ` ;
         recordData.push(data[key]) ;
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
            mm.executeQueryData(`UPDATE ` + goldLoanData + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                   // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update familyDetail information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "FamilyDetail information updated successfully...",
                    });
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
          //  logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
        }
    }
}