const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");
const { connect } = require('../routes/reportScheduler');

const applicationkey = process.env.APPLICATION_KEY;

var reportScheduler = "report_schedular";
var viewReportScheduler = "view_" + reportScheduler;


function reqData(req) {

    var data = {
        REPORT_ID: req.body.REPORT_ID,
        FREQUENCY: req.body.FREQUENCY,
        REPEAT_TIME: req.body.REPEAT_TIME,
        REPEAT_DATA: req.body.REPEAT_DATA,
        EMAIL_IDS: req.body.EMAIL_IDS,
        USER_ID: req.body.USER_ID,
        STATUS: req.body.STATUS,
        SCHEDULAR_ID: req.body.SCHEDULAR_ID,
        PARAMETERS: req.body.PARAMETERS,
        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('REPORT_ID').isInt(), body('FREQUENCY', ' parameter missing').exists(), body('REPEAT_TIME', ' parameter missing').exists(), body('REPEAT_DATA', ' parameter missing').exists(), body('EMAIL_IDS', ' parameter missing').exists(), body('USER_ID').isInt(), body('STATUS', ' parameter missing').exists(), body('SCHEDULAR_ID').isInt(), body('PARAMETERS'), body('ID').optional(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewReportScheduler + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get reportScheduler count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewReportScheduler + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get reportScheduler information."
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
            var connection = db.openConnection();
           
            db.executeDML('INSERT INTO ' + reportScheduler + ' SET ?', data, supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to save reportScheduler information..."
                    });
                }
                else {

                    var PARAMETERS = JSON.parse(data.PARAMETERS)
                        PARAMETERS.REPORT_SCHEDULAR_ID= results.insertId
                    
        
                

                    var rec121 = {

                        "TASK_MASTER_ID": 19,
                        "TIME": data.REPEAT_TIME,
                        "REPEAT_MODE": data.FREQUENCY,
                        "REPEAT_DATA": data.REPEAT_DATA,
                        "PARAMETER": JSON.stringify(PARAMETERS),
                        "SCHEDULER_KEY": mm.generateKey(8),
                        "STATUS": data.STATUS,
                        "USER_ID": 0,
                        "CLIENT_ID": data.CLIENT_ID

                    }

                    mm.sendRequest('POST', 'scheduler/create', rec121, (error, resultsInserts) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection)
                            res.send({
                                "code": 400,
                                "message": "Failed to save reportScheduler information..."
                            });
                        }
                        else {
                            // console.log("resultsInserts ", resultsInserts, data);

                            if (resultsInserts.code == 200) {
                                db.executeDML('update ' + reportScheduler + ' SET SCHEDULAR_ID = ?,PARAMETERS = ? WHERE ID = ?', [resultsInserts.data[0].ID,data.PARAMETERS, results.insertId], supportKey, connection, (error, results) => {
                                    if (error) {
                                        console.log(error);
                                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to save reportScheduler information..."
                                        });
                                    }
                                    else {
                                        console.log(results);
                                        db.commitConnection(connection)
                                        res.send({
                                            "code": 200,
                                            "message": "ReportScheduler information saved successfully...",
                                        });
                                    }
                                });
                            }
                            else {
                                console.log("error", resultsInserts);
                                console.log(results);
                                db.rollbackConnection(connection)
                                res.send({
                                    "code": 400,
                                    "message": "Failed to ReportScheduler information ...",
                                });
                            }
                        }
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
            var connection = db.openConnection();
            db.executeDML(`UPDATE ` + reportScheduler + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey,connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    db.rollbackConnection(connection)
                    res.send({
                        "code": 400,
                        "message": "Failed to update reportScheduler information."
                    });
                }
                else {


       var PARAMETERS = JSON.parse(data.PARAMETERS)
      	PARAMETERS.REPORT_SCHEDULAR_ID= criteria.ID

                    var rec121 = {
                        "ID": data.SCHEDULAR_ID,
                        "TASK_MASTER_ID": 18,
                        "TIME": data.REPEAT_TIME,
                        "REPEAT_MODE": data.FREQUENCY,
                        "REPEAT_DATA": data.REPEAT_DATA,
                        "PARAMETER": JSON.stringify(PARAMETERS),
                        "STATUS": data.STATUS,
                        "USER_ID": 0,
                        "CLIENT_ID": data.CLIENT_ID

                    }

                    mm.sendRequest('PUT', 'scheduler/update', rec121, (error, resultsInserts) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection)
                            res.send({
                                "code": 400,
                                "message": "Failed to update reportScheduler information..."
                            });
                        }
                        else {
                            console.log("resultsInserts ", resultsInserts, data);

                            if (resultsInserts.code == 200) {

                                db.commitConnection(connection)
                                res.send({
                                    "code": 200,
                                    "message": "ReportScheduler information updated successfully...",
                                });
                            }
                            else {
                                console.log("error", resultsInserts);
                                console.log(results);
                                db.rollbackConnection(connection)
                                res.send({
                                    "code": 400,
                                    "message": "Failed to ReportScheduler information ...",
                                });
                            }

                        }
                    });

                    // console.log(results);
                    // res.send({
                    //     "code": 200,
                    //     "message": "ReportScheduler information updated successfully...",
                    // });
                    
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
            console.log(error);
        }
    }
}

var async = require('async')

exports.createReportSchedular = (req, res) => {
	//console.log(req.headers)
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
            var connection = db.openConnection();
            var rData = data.REPEAT_DATA.split(',');

            var recordData = [];
  		   	
            
                for (var i = 0; i < rData.length; i++) {
                    var item = rData[i];
		    var rtData = {

                REPORT_ID: data.REPORT_ID,
                FREQUENCY: data.FREQUENCY,
                REPEAT_TIME: data.REPEAT_TIME,
                EMAIL_IDS: data.EMAIL_IDS,
		REPEAT_DATA :item,
                USER_ID: data.USER_ID,
                STATUS: data.STATUS,
                SCHEDULAR_ID: data.SCHEDULAR_ID,
                PARAMETERS: data.PARAMETERS,
                CLIENT_ID: data.CLIENT_ID
            };
                    
                    recordData.push(rtData);

                }

          

//	console.log("here",recordData)
            async.eachSeries(recordData, function iteratorOverElems(dataItem, callback) {

                db.executeDML('INSERT INTO ' + reportScheduler + ' SET ?', dataItem, supportKey, connection, (error, results) => {
                    if (error) {
                        console.log(error);
                        callback(error)
                    }
                    else {

                      
                      var PARAMETERS = {
                            REPORT_SCHEDULAR_ID: results.insertId
                        }

                   

                        var rec121 = {

                            "TASK_MASTER_ID": 19,
                            "TIME": dataItem.REPEAT_TIME,
                            "REPEAT_MODE": dataItem.FREQUENCY,
                            "REPEAT_DATA": dataItem.REPEAT_DATA,
                            "PARAMETER": JSON.stringify(PARAMETERS),
                            "SCHEDULER_KEY": mm.generateKey(8),
                            "STATUS": dataItem.STATUS,
                            "USER_ID": 0,
                            "CLIENT_ID": dataItem.CLIENT_ID

                        }

                        mm.sendRequest('POST', 'scheduler/create', rec121, (error, resultsInserts) => {
                            if (error) {
                                console.log(error);
                                callback(error)
                            }
                            else {
                               console.log("resultsInserts ", resultsInserts, data);

                                if (resultsInserts.code == 200) {
                                    db.executeDML('update ' + reportScheduler + ' SET SCHEDULAR_ID = ? WHERE ID = ?', [resultsInserts.data[0].ID, results.insertId], supportKey, connection, (error, results) => {
                                        if (error) {
                                            console.log(error);
                                            callback(error)
                                        }
                                        else {
                                            callback()
                                        }
                                    });
                                }
                                else {
                                    callback(error);
                                }
                            }
                        });
                    }
                });
            }, function subCb(error) {
                if (error) {
                    //rollback
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    db.rollbackConnection(connection)
                    res.send({
                        "code": 400,
                        "message": "Failed to save reportScheduler information..."
                    });
                } else {

                    db.commitConnection(connection)
                    res.send({
                        "code": 200,
                        "message": "ReportScheduler information saved successfully...",
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



function getFilter(reportId, params) {
    var filter = '';
    switch (reportId) {
        case 1:

            filter = '' + (params.FROM_DATE && params.TO_DATE ? ` and CREATED_ON_DATETIME between ${params.FROM_DATE} and ${params.TO_DATE} ` : '') + (params.STAGE_IDS ? '' : ` AND CURRENT_STAGE_ID IN (${params.STAGE_IDS})`);

            break;

        case 2:

            break;

        case 3:

            break;

        case 4:

            break;

        default:
            break;
    }

    return filter;

}

