const jwt = require('jsonwebtoken');
const mm = require('../utilities/globalModule');
const formidable = require('formidable');

// var serviceAccount = require("./serviceAccountKey.json");


// exports.uploadImage = function (req, res,filetype) {

//     console.log("Upload  called");
//     const fs = require('fs');
//     //console.log(req);
//     //console.log(req.files.myFileName);

//     fs.rename(req.files.file.path, './'+filetype+'/' + req.files.file.name,
//         (error, result) => {
//             console.log(error)
//             if (error)
//                 res.send(error);
//             else
//                 res.send("success");
//         });
// }

exports.requireAuthentication = function (req, res, next) {
    try {
        var apikey = req.headers['apikey'];
        //console.log(req.headers['apikey'])
        //   console.log(apikey);
        //  console.log(process.env.APIKEY);
        console.log("Checking apiKey");
        // console.log(req);
         console.log(process.env.APIKEY === apikey);
        if (process.env.APIKEY == apikey) {
            console.log("in function");
            next();
        } else {
            //logger.error('APIK' +apikey+' '+req.method+" " + req.url +'UnAutorized User.',req.headers['supportkey']);
            res.send({
                "code": 401,
                "message": "UnAutorized User."
            });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.checkToken = function (req, res, next) {

    try {
        // console.log('token',req.headers['token']);
        if (req.headers['token']) {
            jwt.verify(req.headers['token'], process.env.SECRET, (error, authData) => {
                console.log("checking token");
                if (error) {
                    console.log('error', error);
                    //logger.error('APIK' + apikey + ' ' + req.method + " " + req.url + 'Wrong Token.', req.headers['supportkey']);
                    res.send({
                        "code": 403,
                        "message": "Wrong Token."
                    });
                } else {
                    // console.log( "alae")
                    req.authData = authData;
                    next();
                }
            });
        }
        else {

            res.send({
                "code": 403,
                "message": "No Token Provided."
            });
        }

    } catch (error) {
        console.log(error);
    }
}


const IncomingForm = require('formidable').IncomingForm;

exports.uploadImagehomePageBanner = function (req, res) {

    console.log("Upload  called");
    const fs = require('fs');


    const form = new IncomingForm();
    form.uploadDir = './Uploads/homePageBanner/';
    form.multiples = false;

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            res.send({
                "code": 400,
                "message": "Failed to upload File...",
            });
        }
        else {
            //console.log("file",files);
            fs.rename(files.Image.path, 'uploads/homePageBanner/' + files.Image.name, (error, result) => {
                if (error) {
                    console.log(error)
                    res.send({
                        "code": 400,
                        "message": "Failed to upload File...",
                    });
                } else {
                    console.log("file uploaded...")
                    res.send({
                        "code": 200,
                        "message": "File uploaded successfully...",
                    });
                }

            });
        }
    });


}

exports.sendOtpToDevice = async (req, res) => {

    try {

        var to = req.body.TO;
        var type = req.body.TYPE
        var supportKey = req.headers['supportkey']
	

        //SEND OTP METHOD CALL 
        var otp = 123456//Math.floor(100000 + Math.random() * 900000)

        var body = otp + ' is your One Time Password (OTP) for registration,\nPlease do not share it with anyone.\nThanks & Regards,\nTeam LoanProSys'


        this.sendSMSEmail(type, to, 'SUB Otp Verification', body, (error, results) => {
            if (error) {
                console.log(error)
                res.send({
                    "code": 400,
                    "message": "Failed to OTP SENT",
                });
            }
            else {
                console.log("result out : ", results)


                // if(response.error)
                // {
                //     res.send({
                //         "code": 400,
                //         "message": "OTP FAILED",
                //         //"data": [data]
                //     });
                // }
                // else{
                mm.executeQuery(`select if(count(*) > 0,1,0 ) as IS_PRESENT from view_applicant_master where MOBILE_NUMBER= '${to}'`, supportKey, (error, resultIsPresent) => {
                    if (error) {
                        console.log(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get is present value",

                        });
                    }
                    else {
                        var data = {
                            // "TOKEN": token,
                            // "KEYWORD": "NEW",
                            "OTP": otp,
                            "IS_PRESENT": resultIsPresent[0].IS_PRESENT
                        }
                        res.send({
                            "code": 200,
                            "message": "OTP SENT",
                            "data": [data],

                        });
                    }
                })
            }
        });

    } catch (error) {
        console.log(error);
    }

}

exports.sendOtpToDevice11 = async (req, res) => {

    try {

        var to = req.body.TO;
        var type = req.body.TYPE

        //SEND OTP METHOD CALL 
        var otp = Math.floor(100000 + Math.random() * 900000)

        var body = otp + ' is your One Time Password (OTP) for registration,\nPlease do not share it with anyone.\nThanks & Regards,\nTeam SUB-DHAN'


        this.sendSMSEmail(type, to, 'SUB Otp Verification', body, (error, results) => {
            if (error)
                console.log(error)
            else
                console.log("result out : ", results)
        });

        var data = {
            // "TOKEN": token,
            // "KEYWORD": "NEW",
            "OTP": otp
        }

        // if(response.error)
        // {
        //     res.send({
        //         "code": 400,
        //         "message": "OTP FAILED",
        //         //"data": [data]
        //     });
        // }
        // else{

        res.send({
            "code": 200,
            "message": "OTP SENT",
            "data": [data]
        });
        // }


    } catch (error) {
        console.log(error);
    }

}

exports.sendOtpToDevice1 = async (req, res) => {

    try {

        var to = req.body.TO;
        var type = req.body.TYPE

        //SEND OTP METHOD CALL 
        var otp = Math.floor(100000 + Math.random() * 900000)
        this.sendSMSEmail(type, to, 'Shikuyaa Otp Verification', 'Your Otp is ' + otp, (error, results) => {
            if (error)
                console.log(error)
            else
                console.log("result out : ", results)
        });

        var data = {
            // "TOKEN": token,
            // "KEYWORD": "NEW",
            "OTP": otp
        }

        // if(response.error)
        // {
        //     res.send({
        //         "code": 400,
        //         "message": "OTP FAILED",
        //         //"data": [data]
        //     });
        // }
        // else{

        res.send({
            "code": 200,
            "message": "OTP SENT",
            "data": [data]
        });
        // }


    } catch (error) {
        console.log(error);
    }

}


exports.sendEmail = (req, res) => {
    try {
        var to = req.body.TO;
        var subject = req.body.SUBJECT;
        var body = req.body.BODY;


        this.sendSMSEmail('E', to, subject, body, (error, results) => {
            if (error) {
                console.log(error);
                res.send({
                    "code": 400,
                    "message": "email send failed"
                })
            }
            else {
                console.log(results)
                res.send({
                    "code": 200,
                    "message": "email send successfully"
                })
            }
        })

    } catch (error) {
        console.log(error)
    }
}




exports.sendSMSEmail = (type, to, subject, body, callback) => {
    //using request call send sms method of generic module and send response
    console.log("type : ", type)
    if (type == 'M') {
       /* mm.sendSMS(to, body, (error, result) => {
            if (error) {
                console.log(error);
                callback(error);
            }
            else {
                console.log("results in ", result);
                callback(null, result)
            }
        });
		*/
		callback(null, "send")
    } else if (type == 'E') {
        mm.sendEmail(to, subject, body, (error, results) => {
            if (error) {
                console.log(error);
                callback(error);
            }
            else {
                console.log("results in ", results);
                callback(null, results)
            }
        });
    }
    //return response;
}





var async = require('async')
exports.sendPendingDocumentNotification = (req, res) => {
    try {

        var supportKey = req.headers['supportkey']
        mm.executeQuery(`call sp_firebase_notification_sender`, supportKey, (error, resultsSp) => {
            if (error) {
                console.log(error);
                res.send({
                    "code": 400,
                    "message": "failed to call stored procedure",
                });
            }
            else {
                mm.executeQuery(`select * from firebase_notification where STATUS = 'P'`, supportKey, (error, resultsData) => {
                    if (error) {
                        console.log(error);
                        res.send({
                            "code": 400,
                            "message": "failed to get records ",
                        });
                    }
                    else {
                        if (resultsData.length > 0) {
                            async.eachSeries(resultsData, function iteratorOverElems(notificationData, callback) {
                                require('../utilities/firebase').generateNotificationCallback('', notificationData.CLOUD_ID, notificationData.NOTIFICATION_TYPE, notificationData.TITLE, notificationData.DESCRIPTION, notificationData.REDIRECT_TO, notificationData.REDIRECT_DATA_JSON, '', notificationData.URL, '9', (error, results) => {
                                    if (error) {
                                        console.log(error)
                                        //callback(error);
                                        mm.executeQuery(`update firebase_notification SET STATUS = 'F' where ID = ${notificationData.ID}`, supportKey, (error, resultsUpdate) => {
                                            if (error) {
                                                console.log(error);
                                                callback(error)
                                            }
                                            else {

                                                callback();

                                            }
                                        })
                                    }
                                    else {

                                        if (results && results.successCount == 1) {
                                            mm.executeQuery(`update firebase_notification SET STATUS = 'S' where ID = ${notificationData.ID}`, supportKey, (error, resultsUpdate) => {
                                                if (error) {
                                                    console.log(error);
                                                    callback(error)
                                                }
                                                else {

                                                    callback();

                                                }
                                            })
                                        }
                                        else if (results && results.successCount == 0) {
                                            mm.executeQuery(`update firebase_notification SET STATUS = 'F' where ID = ${notificationData.ID}`, supportKey, (error, resultsUpdate) => {
                                                if (error) {
                                                    console.log(error);
                                                    callback(error)
                                                }
                                                else {

                                                    callback();

                                                }
                                            })

                                        }
                                        else
                                            callback("Error while sending notification");



                                    }
                                })
                            }, function subCb(error) {
                                if (error) {
                                    //rollback
                                    //db.rollbackConnection(connection);
                                    console.log(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to send notification ..."
                                    });
                                } else {
                                    //db.commitConnection(connection);
                                    res.send({
                                        "code": 200,
                                        "message": " Notification send successfully.",
                                    });
                                }
                            });
                            // res.send({
                            //                 "code": 200,
                            //                 "message": " Notification send successfully.",
                            //             });
                        }
                        else {
                            res.send({
                                "code": 400,
                                "message": "No pending records found..."
                            });

                        }
                    }
                })
            }
        });
    } catch (error) {
        console.log(error);
    }
}









