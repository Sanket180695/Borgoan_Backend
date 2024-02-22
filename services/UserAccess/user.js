const mm = require('../../utilities/globalModule');
const db = require('../../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../../utilities/logger");

const jwt = require('jsonwebtoken');

const applicationkey = process.env.APPLICATION_KEY;

var userMaster = "user_master";
var viewUserMaster = "view_" + userMaster;


function reqData(req) {

    var data = {
        ROLE_ID: req.body.ROLE_ID,
        BRANCH_ID: req.body.BRANCH_ID,
        NAME: req.body.NAME,
        EMAIL_ID: req.body.EMAIL_ID,
        MOBILE_NUMBER: req.body.MOBILE_NUMBER,
        IS_ACTIVE: req.body.IS_ACTIVE ? '1' : '0',
        PASSWORD: req.body.PASSWORD,
        CLIENT_ID: req.body.CLIENT_ID,
		LOAN_LIMIT: req.body.LOAN_LIMIT?req.body.LOAN_LIMIT:0.00,

    }
    return data;
}



exports.validate = function () {
    return [

        body('ROLE_ID').isInt(), body('BRANCH_ID').isInt(), body('NAME', ' parameter missing').exists(), body('EMAIL_ID', ' parameter missing').exists(), body('MOBILE_NUMBER', ' parameter missing').exists(), body('PASSWORD', ' parameter missing').exists(), body('ID').optional(),


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
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey']; //Supportkey ;
    try {

        mm.executeQuery('select count(*) as cnt from ' + viewUserMaster + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get users count.",
                });
            } else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewUserMaster + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                        res.send({
                            "code": 400,
                            "message": "Failed to get user information."
                        });
                    } else {

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
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }

}



exports.create = (req, res) => {
    console.log(req.body);
    var data = reqData(req);
    const errors = validationResult(req);
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey']; //Supportkey ;

    var roleData = req.body.ROLE_DATA;

    var connection = db.openConnection()
    if (!errors.isEmpty()) {

        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    } else {
        try {
            db.executeDML('INSERT INTO ' + userMaster + ' SET ?', data, supportKey, connection, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to save user information..."
                    });
                } else {
                    console.log(results);

                    db.commitConnection(connection);
                    res.send({
                        "code": 200,
                        "message": "User information saved successfully...",
                    });

                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
            console.log(error)
        }
    }
}


exports.update = (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);

    var data = reqData(req);
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey']; //Supportkey ;
    var roleData = req.body.ROLE_DATA;

    var connection = db.openConnection()

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
    } else {
        try {
            console.log("here 1");

            db.executeDML(`UPDATE ` + userMaster + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to update user information."
                    });
                } else {
                    console.log("here 2");

                    console.log(results);
                    
                    db.commitConnection(connection);
                    res.send({
                        "code": 200,
                        "message": "User information updated successfully...",
                    });
               
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
            console.log(error);
        }
    }
}



/////Methods with transaction commit rollback 

exports.get1 = async (req, res) => {
    try {
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
        var deviceid = req.headers['deviceid'];
        var supportKey = req.headers['supportkey']; //Supportkey ;


        var connection = await mm.getConnection();


        var countQuery = 'select count(*) as cnt from ' + viewUserMaster + ' where 1 ' + countCriteria;


        await mm.executeQueryTransaction(countQuery, connection).then(async (result) => {
            if (result.length > 0) {
                var dataquery = 'select * from ' + viewUserMaster + ' where 1 ' + criteria;

                await mm.executeQueryTransaction(dataquery, connection).then((results) => {
                    console.log(results);
                    if (results.length > 0) {

                        console.log("Data retrieved : count : ", results[0].cnt)
                        console.log(results);
                        res.send({
                            "code": 200,
                            "message": "success",
                            "count": result[0].cnt,
                            "data": results
                        });
                    } else {
                        //No data found
                        res.send({
                            "code": 200,
                            "message": "No Data"
                        });
                    }
                }, (error) => {
                    console.log('Error occurred in method : ', req.method, "Error : ", error);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    res.send({
                        "code": 400,
                        "message": "Failed to get users count.",
                    });
                });
            } else {
                //No data found
                res.send({
                    "code": 200,
                    "message": "No Data"
                });
            }
        }, (error) => {
            console.log('Error occurred in method : ', req.method, "Error : ", error);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
            res.send({
                "code": 400,
                "message": "Failed to get users count.",
            });
        })
    } catch (error) {
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }
}



exports.create1 = async (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey']; //Supportkey ;

    if (!errors.isEmpty()) {

        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });

    } else {
        try {
            var connection = await mm.getConnection(); //get connection from pool

            mm.executeQueryDataTransaction('INSERT INTO ' + userMaster + ' SET ?', data, connection).then((results) => {
                console.log(results);
                res.send({
                    "code": 200,
                    "message": "User information saved successfully...",
                });

            }, (error) => {
                //console.log("Error in method : ", req.method, req.url, "Error : ", error);
                console.log("Error in method : ", error.sqlMessage);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to save user information..."
                });

            });

            mm.endConnection(connection);

        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
            console.log("Exception in method : ", req.method, req.url, " Error : ", error);
            mm.endConnection(connection);
        }
    }
}



exports.update1 = async (req, res) => {
    try {

        const errors = validationResult(req);
        //console.log(req.body);
        var data = reqData(req);
        var deviceid = req.headers['deviceid'];
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
        } else {

            var connection = await mm.getConnection();
            mm.executeQueryDataTransaction(`UPDATE ` + userMaster + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, connection).then((results) => {
                console.log(results);
                res.send({
                    "code": 200,
                    "message": "User information updated successfully...",
                });
            }, (error) => {
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                console.log(error);
                res.send({
                    "code": 400,
                    "message": "Failed to update user information."
                });
            });
            mm.endConnection(connection);
        }
    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
        mm.endConnection(connection);
    }
}




exports.login = (req, res) => {
    try {

        // console.log(req.headers);
        // console.log(req.body);

        var username = req.body.username;
        var password = req.body.password;
                var cloudId = req.body.CLOUD_ID ? req.body.CLOUD_ID : '';
        var appversion = req.body.APP_VERSION ? req.body.APP_VERSION : '';

        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];


        if ((!username && username == '' && username == undefined) && (!password && password == '' && password == undefined)) {
            res.send({
                "code": 400,
                "message": "username or password parameter missing",
            });
        }
        else {
            //and DEVICE_ID = '${deviceId}
            mm.executeQueryData(`SELECT * FROM ${viewUserMaster}  WHERE  (MOBILE_NUMBER =? or EMAIL_ID=?) and PASSWORD =? and IS_ACTIVE = 1`,[username,username,password], supportKey, (error, results1) => {
                if (error) {
                    console.log(error);
                    // logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

                    res.send({
                        "code": 400,
                        "message": "Failed to login in the application",
                    });
                }
                else {
                    if (results1.length > 0) {

                        mm.executeQueryData(`UPDATE  user_master SET LAST_LOGIN_DATETIME = ?, CLOUD_ID = ?, DEVICE_ID= ?,APP_VERSION =? where ID = ?`,[mm.getSystemDate(),cloudId,deviceid,appversion,results1[0].ID] ,supportKey, (error, resultRole) => {
                            if (error) {
                                console.log(error);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to login in the application",
                                });
                            }
                            else {
                                var userDetails = [{
                                    USER_ID: results1[0].ID,
                                    CLIENT_ID: results1[0].CLIENT_ID,
                                    NAME: results1[0].NAME,
                                    EMAIL_ID: results1[0].EMAIL_ID,
                                    ROLE_ID: results1[0].ROLE_ID,
                                    BRANCH_ID:results1[0].BRANCH_ID
                                }]

                                // mm.executeQueryData(`update user`)

                                generateToken(results1[0].ID, res, userDetails,supportKey);

                            }
                        })
                        
                        // var userDetails = [{
                        //         USER_ID: results1[0].ID,
                        //         CLIENT_ID: results1[0].CLIENT_ID,
                        //         NAME: results1[0].NAME,
                        //         EMAIL_ID: results1[0].EMAIL_ID,
                        //         ROLE_ID: results1[0].ROLE_ID
                        //     }]
    
                        //     // mm.executeQueryData(`update user`)
    
                        //     generateToken(results1[0].ID, res, userDetails);
    
                        //     }
                        // })
                       

                    }
                    else {

                        // logger.error('APIK' +apikey+' '+req.method+" " + req.url +'Email does not exit',req.headers['supportkey']);
                        res.send({
                            "code": 404,
                            "message": "Username OR Password does not exists"
                        });

                    }
                }
            });
        }

    } catch (error) {
        console.log(error);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

        // logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
    }

}

function generateToken(userId, res, resultsUser,supportKey) {

    try {

        var data = {
            "USER_ID": userId,
        }

        jwt.sign({ data }, process.env.SECRET, (error, token) => {
            if (error) {
                console.log("token error", error);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to login in the application",
                });
                //  logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                //logger.error('APIK' + req.headers['apikey'] + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            }
            else {

                // console.log("token generation", token);
                // console.log(data);
                // console.log("jkl :", resultsUser);
     var logAction = `Logged logged in the system.`
                var logDescription = `CONCAT((select NAME from user_master where ID = ${userId}),' logged in the system.')`;

                addLogs(0, logAction, logDescription, userId,0,0, 1,supportKey)
                res.send({
                    "code": 200,
                    "message": "Login sucessfull",
                    "data": [{
                        "token": token,
                        "UserData": resultsUser
                    }]
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function addLogs(PROPOSAL_ID, LOG_ACTION, DESCRIPTION, USER_ID, OLD_STAGE_ID, NEW_STAGE_ID, CLIENT_ID,supportKey) {
    try {
        mm.executeQuery(`insert into proposal_log_information(PROPOSAL_ID,LOG_ACTION,DESCRIPTION,LOG_DATETIME,LOG_TYPE,USER_ID,OLD_STAGE_ID,NEW_STAGE_ID,CLIENT_ID) values (${PROPOSAL_ID},'${LOG_ACTION}',${DESCRIPTION},'${mm.getSystemDate()}','I',${USER_ID},${OLD_STAGE_ID},${NEW_STAGE_ID},${CLIENT_ID})`, supportKey, (error, results) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(results);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

exports.getForms1 = (req, res) => {

    try {
        var userId = req.body.USER_ID;
        var supportKey = req.headers['supportkey'];
        var filter = req.body.filter ? (' AND ' + req.body.filter) : ''

        if (userId) {

            mm.executeQuery(`select ROLE_ID from view_user_master where ID = '${userId}'`, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Record."
                    });
                }
                else {
                    console.log(results);
                    if (results.length > 0) {

                        mm.executeQuery(`select * from view_role_details where ROLE_ID = '${results[0].ROLE_ID}' ${filter} order by SEQ_NO`, supportKey, (error, results) => {
                            if (error) {
                                console.log(error);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to get Record."
                                });
                            }
                            else {
                                res.send({
                                    "code": 200,
                                    "message": "Form Data",
                                    "data": results
                                });
                            }
                        });

                    }
                    else {

                        console.log(error);
                        res.send({
                            "code": 400,
                            "message": "No user found "
                        });

                    }
                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Failed to get Record."
            });
            return
        }

    } catch (error) {
        console.log(error);
    }
}



exports.getForms = (req, res) => {

    try {
        var ROLE_ID = req.body.ROLE_ID;
        var supportKey = req.headers['supportkey'];
        var deviceid = req.headers['deviceid'];

        //var filter = req.body.filter ? (' AND ' + req.body.filter) : ''

        if (ROLE_ID) {

            var query = `SET SESSION group_concat_max_len = 4294967290;SELECT replace(REPLACE(( CONCAT('[',GROUP_CONCAT(JSON_OBJECT('level',1,'title',m.FORM_NAME,'icon',m.ICON,'link',m.link,'SEQ_NO',SEQ_NO,'children',( IFNULL((SELECT replace(REPLACE(( CONCAT('[',GROUP_CONCAT(JSON_OBJECT('level',2,'title',FORM_NAME,'icon',ICON,'link',link,'SEQ_NO',SEQ_NO)),']')),'"[','['),']"',']') FROM view_role_details WHERE PARENT_ID = m.FORM_ID AND ROLE_ID = m.ROLE_ID  and IS_ALLOWED=1 AND SHOW_IN_MENU = 1 order by SEQ_NO ASC),'[]') )
            )),']')),'"[','['),']"',']') AS data FROM view_role_details m WHERE PARENT_ID = 0 AND ROLE_ID = ${ROLE_ID} AND IS_ALLOWED = 1 AND SHOW_IN_MENU = 1 order by SEQ_NO ASC`

            // var query = `SET SESSION group_concat_max_len = 4294967290;
            // select replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'ROLE_ID',ROLE_ID,'FORM_ID',FORM_ID,'IS_ALLOWED',IS_ALLOWED,'SEQ_NO',SEQ_NO,'PARENT_ID',PARENT_ID,'CLIENT_ID',CLIENT_ID,'FORM_NAME',FORM_NAME,'ICON',ICON,'LINK',LINK,'subforms',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'ROLE_ID',ROLE_ID,'FORM_ID',FORM_ID,'IS_ALLOWED',IS_ALLOWED,'SEQ_NO',SEQ_NO,'PARENT_ID',PARENT_ID,'CLIENT_ID',CLIENT_ID,'FORM_NAME',FORM_NAME,'ICON',ICON,'LINK',LINK)),']'),'"[','['),']"',']') FROM view_role_details WHERE ROLE_ID = m.ROLE_ID and  IS_ALLOWED = 1 AND PARENT_ID = m.FORM_ID   order by SEQ_NO asc),'[]'))
            // )),']'),'"[','['),']"',']') as data FROM
            // view_role_details m Where ROLE_ID = ${ROLE_ID} AND IS_ALLOWED = 1 AND PARENT_ID = 0 order by SEQ_NO asc`

            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Record."
                    });
                }
                else {

                    if (results.length > 0) {
                        //console.log(results);
                        var json = results[1][0].data
                        if (json) {
                            json = json.replace(/\\/g, '');
                            json = JSON.parse(json);
                        }
                        //console.log("res : ", json);
                        res.send({
                            "code": 200,
                            "message": "SUCCESS",
                            "data": json
                        });

                    }
                    else {
                        res.send({
                            "code": 400,
                            "message": "No Data",

                        });
                    }
                }
            });

        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing - ROLE_ID "
            });
            return
        }

    } catch (error) {
        console.log(error);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);

    }
}




exports.getDashboardData = (req, res) => {
    try {

        var supportKey = req.headers['supportkey'];
        var MONTH = req.body.MONTH;
        var YEAR = req.body.YEAR;


        if (MONTH && YEAR) {

            var chartQuery = `SELECT
            AAA.date_field,
            IFNULL(BBB.COUNT,0) AS COUNT
        FROM(SELECT date_field
        FROM
        (
            SELECT
                MAKEDATE(${YEAR},1) +
                INTERVAL (${MONTH}-1) MONTH +
                INTERVAL daynum DAY date_field
            FROM
            (
                SELECT t*10+u daynum
                FROM
                    (SELECT 0 t UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) A,
                    (SELECT 0 u UNION SELECT 1 UNION SELECT 2 UNION SELECT 3
                    UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
                    UNION SELECT 8 UNION SELECT 9) B
                ORDER BY daynum
            ) AA
        ) AAA
        WHERE MONTH(date_field) = '${MONTH}') AAA LEFT JOIN (select DISTINCT(DATE_FORMAT(CREATED_ON_DATETIME, '%Y-%m-%d')) AS date_field ,COUNT(*) as COUNT from view_praposal_master where MONTH(CREATED_ON_DATETIME)= '${MONTH}' AND YEAR(CREATED_ON_DATETIME)='${YEAR}' and CURRENT_STAGE_ID=2 GROUP BY DATE_FORMAT(CREATED_ON_DATETIME, '%Y-%m-%d')) BBB
        USING (date_field) order by date_field;`;

            mm.executeQuery(chartQuery, supportKey, (error, resultsChart) => {
                if (error) {
                    console.log(error);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Record."
                    });
                }
                else {
                    var query = `select (select count(*) from view_praposal_master where PRAPOSAL_TYPE ='वैयक्तिक')  AS  INDIVIDUAL_COUNT,
                    (select SUM(LOAN_AMOUNT) from view_praposal_master where PRAPOSAL_TYPE ='वैयक्तिक')  AS  INDIVIDUAL_AMOUNT,
                    (select count(*) from view_praposal_master where PRAPOSAL_TYPE ='व्यवसाईक  / फर्म (संस्था)')  AS FIRM_COUNT,
                    (select SUM(LOAN_AMOUNT) from view_praposal_master where PRAPOSAL_TYPE ='व्यवसाईक  / फर्म (संस्था)')  AS FIRM_AMOUNT`


                    mm.executeQuery(query, supportKey, (error, results) => {
                        if (error) {
                            console.log(error);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                            res.send({
                                "code": 400,
                                "message": "Failed to get Record."
                            });
                        }
                        else {

                            var queryTiles = `SELECT (select COUNT(*)  from view_praposal_master where CURRENT_STAGE_ID IN (3,7,8,16)) AS BANK_SIDE_PENDING_COUNT,
                            (select SUM(LOAN_AMOUNT)  from view_praposal_master where CURRENT_STAGE_ID IN (3,7,8,16)) AS BANK_SIDE_PENDING_AMOUNT,
                            (select COUNT(*)  from view_praposal_master where CURRENT_STAGE_ID IN (2,13,14)) AS CUSTOMER_SIDE_PENDING_COUNT,
                            (select SUM(LOAN_AMOUNT)  from view_praposal_master where CURRENT_STAGE_ID IN (2,13,14)) AS CUSTOMER_SIDE_PENDING_AMOUNT,
                            (select COUNT(*)  from view_praposal_master where CURRENT_STAGE_ID IN (4,5,6)) AS BRANCH_SIDE_PENDING_COUNT,
                            (select SUM(LOAN_AMOUNT)  from view_praposal_master where CURRENT_STAGE_ID IN (4,5,6)) AS BRANCH_SIDE_PENDING_AMOUNT,
                            (SELECT COUNT(*)  from view_praposal_master where CURRENT_STAGE_ID = 17) AS APPROVED_COUNT,
                            (SELECT SUM(LOAN_AMOUNT)  from view_praposal_master where CURRENT_STAGE_ID = 17) AS APPROVED_AMOUNT,
                            (SELECT COUNT(*)  from view_praposal_master where CURRENT_STAGE_ID = 10) AS REJECTED_COUNT,
                            (SELECT SUM(LOAN_AMOUNT)  from view_praposal_master where CURRENT_STAGE_ID = 10) AS REJECTED_AMOUNT;`


                            mm.executeQuery(queryTiles, supportKey, (error, resultsTILES) => {
                                if (error) {
                                    console.log(error);
                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Record."
                                    });
                                }
                                else {

                                    var queryBarChart = `SELECT NAME,(SELECT COUNT(*) FROM loan_demand WHERE BANK_LOAN_TYPE_ID = m.ID  AND PROPOSAL_ID IN (SELECT ID FROM praposal_master WHERE CURRENT_STAGE_ID NOT IN (10,9,17))) AS COUNT,IFNULL((SELECT sum(LOAN_AMOUNT) FROM loan_demand WHERE BANK_LOAN_TYPE_ID = m.ID  AND PROPOSAL_ID IN (SELECT ID FROM praposal_master WHERE CURRENT_STAGE_ID NOT IN (10,9,17))),0.00) AS AMOUNT FROM loan_scheme_master m WHERE IS_ACTIVE = 1`;

                                    mm.executeQuery(queryBarChart, supportKey, (error, resultsBarChart) => {
                                        if (error) {
                                            console.log(error);
                                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to get Record."
                                            });
                                        }
                                        else {

                                            var queryBranchReport = `select NAME,(SELECT COUNT(*) FROM view_praposal_master WHERE BRANCH_ID = m.ID  AND CURRENT_STAGE_ID NOT IN (10,9,17)) AS COUNT,IFNULL((SELECT sum(LOAN_AMOUNT) FROM view_praposal_master WHERE BRANCH_ID = m.ID  AND CURRENT_STAGE_ID NOT IN (10,9,17)),0.00) AS AMOUNT from branch_master m`


                                            mm.executeQuery(queryBranchReport, supportKey, (error, resultsBranchReport) => {
                                                if (error) {
                                                    console.log(error);
                                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                                    res.send({
                                                        "code": 400,
                                                        "message": "Failed to get Record."
                                                    });
                                                }
                                                else {

                                                    res.send({
                                                        "code": 200,
                                                        "message": "SUCCESS",
                                                        "data": [{
                                                            LINE_DATA: resultsChart,
                                                            PIE_DATA: results,
                                                            TILES_DATA: resultsTILES,
                                                            BAR_CHART_DATA: resultsBarChart,
                                                            BRANCH_DATA: resultsBranchReport

                                                        }]
                                                    });
                                                }
                                            });

                                        }
                                    });

                                }
                            });
                        }
                    });

                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "PARAMETER MISSING- MONTH AND YEAR"
            });

        }
    } catch (error) {
        console.log(error)
    }
}


exports.changePassword = (req, res) => {
    try {

        var newPass = req.body.N_PASSWORD;
        var oldPassword = req.body.O_PASSWORD;
        var USER_ID = req.body.USER_ID;
        var deviceid = req.headers['deviceid']; var supportKey = req.headers['supportkey'];//Supportkey ;

        if (USER_ID && newPass && oldPassword) {

            mm.executeQueryData(`select * from view_user_master where ID = ? and PASSWORD = ?`, [USER_ID, oldPassword], supportKey, (error, result) => {
                if (error) {
                    console.log(error);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Record."
                    });
                }
                else {
                    if (result.length > 0) {

                        mm.executeQueryData(`select * from view_user_master where ID = ? and PASSWORD = ?`, [USER_ID, oldPassword], supportKey, (error, result2) => {
                            if (error) {
                                console.log(error);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to get Record."
                                });
                            }
                            else {

                                mm.executeQueryData(`update  user_master set PASSWORD = ?  where ID = ?`, [newPass, USER_ID], supportKey, (error, result1) => {
                                    if (error) {
                                        console.log(error);
                                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to get Record."
                                        });
                                    }
                                    else {

                                        res.send({
                                            "code": 200,
                                            "message": "New Password successfully updated."
                                        });

                                    }
                                });
                            }
                        });

                    }
                    else {
                        res.send({
                            "code": 400,
                            "message": "Incorrect old password.Please contanct your administrator."
                        });

                    }
                }
            });

        }
        else {

            res.send({
                "code": 400,
                "message": "parameter missing"
            });

        }

    } catch (error) {
        console.log(error)
    }
}


exports.getPraposalChartData = (req, res) => {
    try {

        var supportKey = req.headers['supportkey'];
        var MONTH = req.body.MONTH;
        var YEAR = req.body.YEAR;
        var type = req.body.TYPE;

        if (MONTH && YEAR) {

            var chartQuery = `SELECT
            AAA.date_field,
            IFNULL(BBB.COUNT,0) AS COUNT
        FROM(SELECT date_field
        FROM
        (
            SELECT
                MAKEDATE(${YEAR},1) +
                INTERVAL (${MONTH}-1) MONTH +
                INTERVAL daynum DAY date_field
            FROM
            (
                SELECT t*10+u daynum
                FROM
                    (SELECT 0 t UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) A,
                    (SELECT 0 u UNION SELECT 1 UNION SELECT 2 UNION SELECT 3
                    UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
                    UNION SELECT 8 UNION SELECT 9) B
                ORDER BY daynum
            ) AA
        ) AAA
        WHERE MONTH(date_field) = '${MONTH}') AAA LEFT JOIN (select DISTINCT(DATE_FORMAT(CREATED_ON_DATETIME, '%Y-%m-%d')) AS date_field ,`+(type == 'C'?` COUNT(*) `:`sum(LOAN_AMOUNT)`)+` as COUNT from view_praposal_master where MONTH(CREATED_ON_DATETIME)= '${MONTH}' AND YEAR(CREATED_ON_DATETIME)='${YEAR}' and CURRENT_STAGE_ID=2 GROUP BY DATE_FORMAT(CREATED_ON_DATETIME, '%Y-%m-%d')) BBB
        USING (date_field) order by date_field;`;

            mm.executeQuery(chartQuery, supportKey, (error, resultsChart) => {
                if (error) {
                    console.log(error);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Record."
                    });
                }
                else {
                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": resultsChart
                    });

                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "PARAMETER MISSING- MONTH AND YEAR"
            });

        }
    } catch (error) {
        console.log(error)
    }
}


exports.getDashboardCounts = (req, res) => {
    var supportKey = req.headers['supportkey'];
    var query = `SELECT COUNT(*) AS TOTAL_BRANCHES FROM view_branch_master;
        SELECT COUNT(*) AS TOTAL_USERS FROM view_user_master;
        SELECT COUNT(*) AS TOTAL_DOCUMENTS FROM view_document_master;
        SELECT COUNT(*) AS TOTAL_LOAN_TYPES FROM view_loan_scheme_master;
    
        SELECT COUNT(*) AS TOTAL_PRAPOSALS,
        (SELECT COUNT(*) FROM view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13))AS IN_PROCESS_PRAPOSALS,
        (SELECT COUNT(*) FROM view_praposal_master WHERE CURRENT_STAGE_ID=13)AS DISBURSED_PRAPOSALS ,
        (SELECT COUNT(*) FROM view_praposal_master WHERE CURRENT_STAGE_ID=6)AS REJECTED_PRAPOSALS
        FROM view_praposal_master;

        SELECT SUM(LOAN_AMOUNT) AS TOTAL_LOAN_AMOUNT,
        (SELECT SUM(LOAN_AMOUNT) FROM view_praposal_master WHERE CURRENT_STAGE_ID NOT IN(6,13))AS IN_PROCESS_LOAN_AMOUNT,
        (SELECT SUM(LOAN_AMOUNT) FROM view_praposal_master WHERE CURRENT_STAGE_ID=13)AS DISBURSED_LOAN_AMOUNT,
        (SELECT SUM(LOAN_AMOUNT) FROM view_praposal_master WHERE CURRENT_STAGE_ID=6)AS REJECTED_LOAN_AMOUNT
        FROM view_praposal_master;

        SELECT COUNT(*) AS TOTAL_APPLICANT_DOCUMENTS, 
        (SELECT COUNT(*) FROM view_applicant_documents WHERE IS_UPLOADED=0)AS PENDING_DOCUMENTS ,
        (SELECT COUNT(*) FROM view_applicant_documents WHERE IS_APPROVED=1)AS APPROVED_DOCUMENTS,
        (SELECT COUNT(*) FROM view_applicant_documents WHERE IS_APPROVED=0)AS REJECTED_DOCUMENTS 
        FROM view_applicant_documents;

        SELECT COUNT(*)AS TOTAL_APPLICANTS,
        (SELECT COUNT(APPLICANT_ID) from view_praposal_master where CURRENT_STAGE_ID=13)AS LOAN_DISBURSED_APPLICANTS,
        (SELECT COUNT(APPLICANT_ID) from view_praposal_master where CURRENT_STAGE_ID=6)AS LOAN_REJECTED_APPLICANTS,
        (SELECT COUNT(distinct APPLICANT_ID) from view_praposal_master where CURRENT_STAGE_ID NOT IN(6,13))AS LOAN_IN_PROCESS_APPLICANTS FROM view_applicant_master;`;
    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get counts.",
                });
            }
            else {
                // console.log(results);
                res.send({
                    "code": 200,
                    "message": "success",
                    "data": {
                        "TOTAL_BRANCHES": results[0][0].TOTAL_BRANCHES,
                        "TOTAL_USERS": results[1][0].TOTAL_USERS,
                        "TOTAL_DOCUMENTS": results[2][0].TOTAL_DOCUMENTS,
                        "TOTAL_LOAN_TYPES": results[3][0].TOTAL_LOAN_TYPES,
                        "TOTAL_PRAPOSALS": results[4][0].TOTAL_PRAPOSALS,
                        "IN_PROCESS_PRAPOSALS": results[4][0].IN_PROCESS_PRAPOSALS,
                        "DISBURSED_PRAPOSALS": results[4][0].DISBURSED_PRAPOSALS,
                        "REJECTED_PRAPOSALS": results[4][0].REJECTED_PRAPOSALS,
                        "TOTAL_LOAN_AMOUNT": results[5][0].TOTAL_LOAN_AMOUNT,
                        "IN_PROCESS_LOAN_AMOUNT": results[5][0].IN_PROCESS_LOAN_AMOUNT,
                        "DISBURSED_LOAN_AMOUNT": results[5][0].DISBURSED_LOAN_AMOUNT,
                        "REJECTED_LOAN_AMOUNT": results[5][0].REJECTED_LOAN_AMOUNT,
                        "TOTAL_APPLICANT_DOCUMENTS": results[6][0].TOTAL_APPLICANT_DOCUMENTS,
                        "PENDING_DOCUMENTS": results[6][0].PENDING_DOCUMENTS,
                        "APPROVED_DOCUMENTS": results[6][0].APPROVED_DOCUMENTS,
                        "REJECTED_DOCUMENTS": results[6][0].REJECTED_DOCUMENTS,
                        "TOTAL_APPLICANTS": results[7][0].TOTAL_APPLICANTS,
                        "LOAN_DISBURSED_APPLICANTS": results[7][0].LOAN_DISBURSED_APPLICANTS,
                        "LOAN_REJECTED_APPLICANTS": results[7][0].LOAN_REJECTED_APPLICANTS,
                        "LOAN_IN_PROCESS_APPLICANTS": results[7][0].LOAN_IN_PROCESS_APPLICANTS
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



exports.getLoanTypeLineChart = (req, res) => {
    var supportKey = req.headers['supportkey'];
    let filter = req.body.filter ? req.body.filter : '';

    var query = `SELECT ID AS LOAN_TYPE_ID,NAME_MR,NAME_EN,NAME_KN,ifnull(a.COUNT,0) AS CNT,ifnull(a.TOTAL_AMOUNT,0) AS TOTAL_AMOUNT
	FROM view_loan_scheme_master LEFT JOIN (select 
		LOAN_TYPE_ID AS LOAN_TYPE_ID,
		COUNT(*) AS COUNT,
		SUM(LOAN_AMOUNT) AS TOTAL_AMOUNT
            FROM view_praposal_master WHERE 1 ${filter}
                group by LOAN_TYPE_ID ) a on (view_loan_scheme_master.ID = a.LOAN_TYPE_ID) ;`

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get loan type graph details ...",
                });
            }
            else {
                // console.log(results);
                res.send({
                    "code": 200,
                    "message": "success",
                    "data":results
                });
            }
        });
    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        console.log(error);
    }
}

exports.getBranchLineChart = (req, res) => {
    var supportKey = req.headers['supportkey'];
    let filter = req.body.filter ? req.body.filter : '';

    var query = `SELECT  ID,view_branch_master.NAME_MR,view_branch_master.NAME_EN,view_branch_master.NAME_KN,ifnull(a.COUNT,0) AS CNT,ifnull(a.TOTAL_AMOUNT,0) AS TOTAL_AMOUNT
    FROM view_branch_master LEFT JOIN (select
            BRANCH_NAME,
            COUNT(*) AS COUNT,
            SUM(LOAN_AMOUNT) AS TOTAL_AMOUNT
               FROM view_praposal_master where 1 ${filter}
                 group by BRANCH_NAME ) a on (view_branch_master.NAME_MR = a.BRANCH_NAME);;`

    try {
        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to branch graph details ...",
                });
            }
            else {
                // console.log(results);
                res.send({
                    "code": 200,
                    "message": "success",
                    "data":results
                });
            }
        });
    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
        console.log(error);
    }
}

