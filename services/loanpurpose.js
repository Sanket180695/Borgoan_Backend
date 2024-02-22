const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var loanPurposeMaster = "loan_purpose_master";
var viewLoanPurposeMaster = "view_" + loanPurposeMaster;


function reqData(req) {

    var data = {
NAME: req.body.NAME,
LOAN_TYPE_ID: req.body.LOAN_TYPE_ID,

 CLIENT_ID :req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

body('NAME',' parameter missing').exists(),body('ID').optional(),

  
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
        mm.executeQuery('select count(*) as cnt from ' + viewLoanPurposeMaster + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
		logger.error( supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);	                
		res.send({
                    "code": 400,
                    "message": "Failed to get loanPurposes count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewLoanPurposeMaster + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error( supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
			res.send({
                            "code": 400,
                            "message": "Failed to get loanPurpose information."
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
        logger.error( supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
	console.log(error);
    }

}


exports.create = (req, res) => {

    var data = reqData(req);
    const errors= validationResult(req);
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
            mm.executeQueryData('INSERT INTO ' + loanPurposeMaster + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error( supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
			res.send({
                        "code": 400,
                        "message": "Failed to save loanPurpose information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "LoanPurpose information saved successfully...",
                    });
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error( supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
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
      data[key] ? setData += `${key}= ? , `: true;
        data[key] ? recordData.push(data[key]): true;
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
            mm.executeQueryData(`UPDATE ` + loanPurposeMaster + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `,recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error( supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);    
		console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update loanPurpose information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "LoanPurpose information updated successfully...",
                    });
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error( supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);    
	console.log(error);
        }
    }
}