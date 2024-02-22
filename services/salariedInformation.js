const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var salariedInformation = "salaried_information";
var viewSalariedInformation = "view_" + salariedInformation;


function reqData(req) {

    var data = {
        INCOME_INFORMATION_ID: req.body.INCOME_INFORMATION_ID,
        PLACE_OF_EMPLOYMENT: req.body.PLACE_OF_EMPLOYMENT,
        ORGANISATION_NAME: req.body.ORGANISATION_NAME,
        CONTACT_NO_OF_EMPLOYER: req.body.CONTACT_NO_OF_EMPLOYER,
        POST_OF_EMPLOYMENT: req.body.POST_OF_EMPLOYMENT,
        TYPE_OF_SECTOR: req.body.TYPE_OF_SECTOR,
        TYPE_OF_EMPLOYMENT: req.body.TYPE_OF_EMPLOYMENT,
        IS_PROVIDENT_FUND_DEDUCTED: req.body.IS_PROVIDENT_FUND_DEDUCTED ? '1' : '0',
        JOINING_DATE: req.body.JOINING_DATE?req.body.JOINING_DATE:null,
        RETIREMENT_DATE: req.body.RETIREMENT_DATE?req.body.RETIREMENT_DATE:null,
        LATEST_SALARY_MONTH: req.body.LATEST_SALARY_MONTH,
        GROSS_SALARY: req.body.GROSS_SALARY ? req.body.GROSS_SALARY : 0,
        TOTAL_DEDUCTION: req.body.TOTAL_DEDUCTION ? req.body.TOTAL_DEDUCTION : 0,
        NET_SALARY: req.body.NET_SALARY ? req.body.NET_SALARY : 0,
        SALARY_PAID_TYPE: req.body.SALARY_PAID_TYPE,
        IS_LETTER_FOR_LOAN_DEDUCTION: req.body.IS_LETTER_FOR_LOAN_DEDUCTION ? '1' : '0',
        APPLICANT_DOCUMENTS_ID: req.body.APPLICANT_DOCUMENTS_ID,
        BANK_NAME: req.body.BANK_NAME ? req.body.BANK_NAME : '',
        BRANCH_NAME: req.body.BRANCH_NAME ? req.body.BRANCH_NAME : '',
        IFSC_CODE: req.body.IFSC_CODE ? req.body.IFSC_CODE : '',
        CLIENT_ID: req.body.CLIENT_ID,
	   PROVIDANT_FUND: req.body.PROVIDANT_FUND?req.body.PROVIDANT_FUND:0,
        INSURANCE: req.body.INSURANCE?req.body.INSURANCE:0,
        INCOME_TAX: req.body.INCOME_TAX?req.body.INCOME_TAX:0,
        LOAN_INSTALLMENT: req.body.LOAN_INSTALLMENT?req.body.LOAN_INSTALLMENT:0,
        OTHER_DEDUCTION: req.body.OTHER_DEDUCTION?req.body.OTHER_DEDUCTION:0,

    }
    return data;
}



exports.validate = function () {
    return [

        body('INCOME_INFORMATION_ID').isInt().optional(), body('PLACE_OF_EMPLOYMENT').isInt().optional(), body('ORGANISATION_NAME').optional(), body('CONTACT_NO_OF_EMPLOYER').optional(), body('POST_OF_EMPLOYMENT').optional(), body('TYPE_OF_SECTOR').optional(), body('TYPE_OF_EMPLOYMENT').optional(), body('JOINING_DATE').optional(), body('RETIREMENT_DATE').optional(), body('LATEST_SALARY_MONTH').optional(), body('GROSS_SALARY').isDecimal().optional(), body('TOTAL_DEDUCTION').isDecimal().optional(), body('NET_SALARY').isDecimal().optional(), body('SALARY_PAID_TYPE').optional(), body('APPLICANT_DOCUMENTS_ID').isInt().optional(), body('BANK_NAME').optional(), body('BRANCH_NAME').optional(), body('IFSC_CODE').optional(), body('ID').optional(),
        body('IS_LETTER_FOR_LOAN_DEDUCTION').optional().toInt().isInt(),
        body('IS_PROVIDENT_FUND_DEDUCTED').optional().toInt().isInt(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewSalariedInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get salariedInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewSalariedInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get salariedInformation information."
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
            mm.executeQueryData('INSERT INTO ' + salariedInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save salariedInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "SalariedInformation information saved successfully...",
                        "data": [{
                            ID: results.insertId
                        }]
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
            mm.executeQueryData(`UPDATE ` + salariedInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update salariedInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "SalariedInformation information updated successfully...",
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
