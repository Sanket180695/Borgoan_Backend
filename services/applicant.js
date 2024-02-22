const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");
const jwt = require('jsonwebtoken');

const applicationkey = process.env.APPLICATION_KEY;

var applicantMaster = "applicant_master";
var viewApplicantMaster = "view_" + applicantMaster;


function reqData(req) {

    var data = {
        NAME: req.body.NAME,
        MOBILE_NUMBER: req.body.MOBILE_NUMBER,
        REGISTRATION_DATETIME: req.body.REGISTRATION_DATETIME,
        LAST_OPENED_DATETIME: req.body.LAST_OPENED_DATETIME,
        APP_VERSION: req.body.APP_VERSION,
        CLOUD_ID: req.body.CLOUD_ID,
        DEVICE_ID: req.body.DEVICE_ID,

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('NAME', ' parameter missing').exists(), body('MOBILE_NUMBER', ' parameter missing').exists(), 
//body('REGISTRATION_DATETIME', ' parameter missing').exists(),
// body('LAST_OPENED_DATETIME', ' parameter missing').exists(), body('APP_VERSION', ' parameter missing').exists(), body('CLOUD_ID', ' parameter missing').exists(), body('DEVICE_ID', ' parameter missing').exists(), body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewApplicantMaster + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get applicants count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewApplicantMaster + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get applicant information."
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
  data.REGISTRATION_DATETIME=mm.getSystemDate();
            data.LAST_OPENED_DATETIME=mm.getSystemDate();
            mm.executeQueryData('INSERT INTO ' + applicantMaster + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save applicant information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "Applicant information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + applicantMaster + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update applicant information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "Applicant information updated successfully...",
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


exports.register = (req, res) => {
    try {

        var MOBILE_NUMBER = req.body.MOBILE_NUMBER;
        var CLOUD_ID = req.body.CLOUD_ID;
        var DEVICE_ID = req.body.DEVICE_ID;
        var APP_VERSION = req.body.APP_VERSION;
        var CLIENT_ID = req.body.CLIENT_ID;
        var systemDate = mm.getSystemDate();
        var supportKey = req.headers['supportkey'];

        if (MOBILE_NUMBER && CLOUD_ID && DEVICE_ID && APP_VERSION) {


            mm.executeQuery(`select * from ` + viewApplicantMaster + ` where MOBILE_NUMBER = '${MOBILE_NUMBER}'`, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to get applicant information."
                    });
                }
                else {
                    if (results.length > 0) {
                        mm.executeQueryData(`UPDATE ` + applicantMaster + ` SET  LAST_OPENED_DATETIME = ?,CLOUD_ID=?,DEVICE_ID=?,APP_VERSION=? where ID = ${results[0].ID} `, [systemDate, CLOUD_ID, DEVICE_ID, APP_VERSION], supportKey, (error, resultsUpdate) => {
                            if (error) {
                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                console.log(error);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to update applicant information."
                                });
                            }
                            else {
                                console.log(results);
                                var data1 = results[0];
                                data1.LAST_OPENED_DATETIME = systemDate;
                                data1.CLOUD_ID = CLOUD_ID;
                                data1.DEVICE_ID = DEVICE_ID;
                                data1.APP_VERSION = APP_VERSION;

                                
                                jwt.sign({ }, process.env.SECRET, (error, token) => {
                                    if (error) {
                                        console.log("token error", error);

                                        res.send({
                                            "code": 400,
                                            "message": "Failed to generate token information..."
                                        });
                                        //  logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                        //logger.error('APIK' + req.headers['apikey'] + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                    }
                                    else {
                        
                                        console.log("token generation", token);
                                        console.log(data1);
                                       // console.log("jkl :",resultsApplication);

                                        require('../utilities/firebase').generateNotification('',CLOUD_ID, 'N', 'LoanProSys', 'LoanProSys अँप मध्ये आपले सहर्ष स्वागत !', '', '', '', '', '9')

                        
                                        res.send({
                                            "code": 200,
                                            "message": "Applicant information saved successfully...",
                                            "data": [{
                                                "token": token,
                                                "UserData": data1
                                            }]
                                        });
                                    }
                                });
                               
                            }
                        });
                    }
                    else {

                        var data = {

                            NAME: req.body.NAME ? req.body.NAME : '',
                            MOBILE_NUMBER: MOBILE_NUMBER,
                            REGISTRATION_DATETIME: systemDate,
                            LAST_OPENED_DATETIME: systemDate,
                            APP_VERSION: APP_VERSION,
                            CLOUD_ID: CLOUD_ID,
                            DEVICE_ID: DEVICE_ID,
                            CLIENT_ID: CLIENT_ID

                        }


                        mm.executeQueryData('INSERT INTO ' + applicantMaster + ' SET ?', data, supportKey, (error, results) => {
                            if (error) {
                                console.log(error);
                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to save applicant information..."
                                });
                            }
                            else {
                                console.log(results);
                                data.ID = results.insertId;


                                jwt.sign({  }, process.env.SECRET, (error, token) => {
                                    if (error) {
                                        console.log("token error", error);

                                        res.send({
                                            "code": 400,
                                            "message": "Failed to generate token information..."
                                        });
                                        //  logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                        //logger.error('APIK' + req.headers['apikey'] + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                    }
                                    else {
                        
                                        console.log("token generation", token);
                                        console.log(data);
                                       // console.log("jkl :",resultsApplication);
                        
                                        res.send({
                                            "code": 200,
                                            "message": "Applicant information saved successfully...",
                                            "data": [{
                                                "token": token,
                                                "UserData": data
                                            }]
                                        });
                                    }
                                });
                            }
                        });
                    }

                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing - MOBILE_NUMBER,CLOUD_ID,DEVICE_ID,APP_VERSION,CLIENT_ID"
            });
        }
    } catch (error) {
        console.log(error);
    }

}





exports.updateLastLogin = (req,res)=>{
    try {
        
        var APPLICANT_ID = req.body.APPLICANT_ID;
        
        var supportKey = req.headers['supportkey'];
        if(APPLICANT_ID){


            mm.executeQueryData(`UPDATE ` + applicantMaster + ` SET  LAST_OPENED_DATETIME = ? where ID = ${APPLICANT_ID} `,[mm.getSystemDate()], supportKey, (error, resultsUpdate) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update applicant information."
                    });
                }
                else {
                 mm.executeQuery(`select VALUE from global_settings where KEYWORD = 'MIN_VERSION'`, supportKey,(error,resultsMaxVersion)=>{
                        if(error)
                        {
                            console.log(error);
                            // console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                            res.send({
                                "code": 400,
                                "message": "Failed to get users count.",
                            });
                        }
                        else
                        {
            
                            mm.executeQuery(`select VALUE from global_settings where KEYWORD = 'CUR_VERSION'`, supportKey,(error,resultscurVersion)=>{
                                if(error)
                                {
                                    console.log(error);
                                    //console.log(error);
                                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                    // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get users count.",
                                    });
                                }
                                else
                                {
                                    res.send({
                                        "code": 200,
                                        "message": "success",
                                        "data":[{
                                            MIN_VERSION:resultsMaxVersion[0].VALUE,
                                            CUR_VERSION:resultscurVersion[0].VALUE,
                                        }]
                                    });
                                }
                            });  
                        }
                    });
                }
            });
        }
        else
        {
            res.send({
                "code": 400,
                "message": "Parameter Missing - APPLICANT_ID",
            });
        }


    } catch (error) {
        console.log(error);
    }
}
exports.getDashBoardData1 = (req, res) => {
    try {

        var USER_ID = req.body.USER_ID;
        var supportKey = req.headers['supportkey'];

        if (USER_ID) {

            mm.executeQuery(`select * from view_home_page_banners where STATUS = '1'`, supportKey, (error, resultsBannerData) => {
                if (error) {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get banner data information."
                    });
                }
                else {
                    //console.log(resultsBannerData);
                    mm.executeQuery(`select * from view_home_page_information`, supportKey, (error, resultsBannerInfo) => {
                        if (error) {
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to get banner information."
                            });
                        }
                        else {
                            //console.log(resultsBannerInfo);
                            mm.executeQuery(`SELECT BRANCH_ID FROM user_master WHERE ID= ${USER_ID}`, supportKey, (error, resultsBranchID) => {
                                if (error) {
                                    console.log(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get brach id information."
                                    });
                                }
                                else {

                                    // console.log(resultsBranchID);
                                    res.send({
                                        "code": 200,
                                        "message": "success",
                                        "data": [
                                            {
                                                "BANNER": resultsBannerData,
                                                "INFO": resultsBannerInfo[0].INFO_TEXT,
                                                "BRANCH_ID": resultsBranchID[0].BRANCH_ID,
                                            }
                                        ]
                                    });
                                }
                            });
                        }
                    })
                }
            })

        } else {
            res.send({
                "code": 400,
                "message": "PARAMETER missing- USER_ID"
            });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getDashBoardData = (req, res) => {
    try {

        var APPLICANT_ID = req.body.APPLICANT_ID;
        var supportKey = req.headers['supportkey'];

        if (APPLICANT_ID) {

            mm.executeQuery(`select * from view_home_page_banners where STATUS = '1'`, supportKey, (error, resultsBannerData) => {
                if (error) {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get banner data information."
                    });
                }
                else {
                    //console.log(resultsBannerData);
                    mm.executeQuery(`select * from view_home_page_information`, supportKey, (error, resultsBannerInfo) => {
                        if (error) {
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to get banner information."
                            });
                        }
                        else {
                            //console.log(resultsBannerInfo);
                              mm.executeQuery(`select if(count(*) > 0,1,0) as IS_APPLIED,(select VALUE FROM global_settings where KEYWORD = 'BOT_URL') AS BOT_URL  from view_praposal_master where APPLICANT_ID = '${APPLICANT_ID}'`, supportKey, (error, resultsPraposalData) => {
                                if (error) {
                                    console.log(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get proposal information."
                                    });
                                }
                                else {

                                   // console.log(resultsPraposalData);
                                    res.send({
                                        "code": 200,
                                        "message": "success",
                                        "data": [
                                            {
                                                "BANNER": resultsBannerData,
                                                "INFO": resultsBannerInfo[0].INFO_TEXT,
                                                "IS_APPLIED": resultsPraposalData[0].IS_APPLIED,
                                                "BOT_URL": resultsPraposalData[0].BOT_URL,
                                            }
                                        ]
                                    });
                                }
                            });
                        }
                    })
                }
            })

        } else {
            res.send({
                "code": 400,
                "message": "PARAMETER missing- APPLICANT_ID"
            });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getDetails = (req, res) => {
    try {
        var applicantId = req.body.APPLICANT_ID;

        var supportKey = req.headers['supportkey'];


        if (applicantId) {

            db.executeDQL(`select  (select if(count(*) > 0,1,0) from guarantor_information where APPLICANT_ID = ${applicantId} and VISIBILITY = 1) AS IS_GUARANTOR,(select if(count(*) > 0,1,0) from coborrower_information where APPLICANT_ID = ${applicantId} and VISIBILITY = 1) AS IS_COBORROWER`,'', supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);

                    res.send({
                        "code": 400,
                        "message": "Failed to get information..."
                    });
                }
                else {

                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": results
                    });
                }
            });

        }
        else {

            res.send({
                "code": 400,
                "message": "parameter missing - applicantId"
            });

        }

    } catch (error) {
        console.log(error);
    }
}