const dbConfig = require("./dbConfig");



//const lgConfig = require("../logger/loggerDbConfig");
const logger = require("./logger");

var applicationkey = process.env.APPLICATION_KEY


exports.sendRequest = (methodType,method, body,callback) => {
    try {
  
      var request = require('request');
  
      // var key = body.includes('OTP') ? process.env.SMS_SERVER_KEY_OTP : process.env.SMS_SERVER_KEY;
  
      var options = {
        url: process.env.GM_API + method,
        headers: {
          "apikey": process.env.GM_API_KEY,
          "supportkey": process.env.SUPPORT_KEY,
          //"applicationkey": process.env.APPLICATION_KEY
        },
        body: body,
        method:methodType,
        json: true
      }
  
      request(options, (error, response, body) => {
        if (error) {
          console.log("request error -send email ", error);
          //sms sent failed
          //data.STATUS = 'F';
          callback(error);
        } else {
          console.log(body);
          //sms sent  
          // CHECK STATUS FOR SENT SMS
          callback(null, body);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

exports.diff_hours = (dt2, dt1) => {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(diff);

}


exports.diff_minutes = (dt2, dt1) => {
    //console.log(dt2, dt1);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(diff);

}



exports.generateKeyNumber = function (size,BRANCH_ID,LOAN_TYPE_ID,APPLICANT_ID) {

    var chars = '0123456789';
    var result = '';
    for (var i = size; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    console.log('length = ', result.length);
    //return result;
    return "111";

}
exports.generatePraposalId = function (size,BRANCH_ID,LOAN_TYPE_ID,APPLICANT_ID) {

    //var chars = '0123456789';
    var result = '';
   // for (var i = size; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    console.log('length = ', result.length);
    //return result;
   console.log("BRANCH_ID_CHECK", BRANCH_ID)
    var branch_code=0;
    var Loan_Scheme_Id=0;
    var appicant_id=0;

    var branch_code_length= BRANCH_ID.toString().length;
    var Loan_Scheme_Id_length= LOAN_TYPE_ID.toString().length;
    var applicant_id_length= APPLICANT_ID.toString().length;
    if(branch_code_length==1)
    {
        branch_code="000"+BRANCH_ID.toString();
    }
    if(branch_code_length==2)
    {
        branch_code="00"+BRANCH_ID.toString();
    }
    if(branch_code_length==3)
    {
        branch_code="0"+BRANCH_ID.toString();
    }
    if(branch_code_length==4)
    {
        branch_code= BRANCH_ID.toString();
    }

    if(Loan_Scheme_Id_length==1)
    {
        Loan_Scheme_Id="00"+LOAN_TYPE_ID.toString();
    }
    if(Loan_Scheme_Id_length==2)
    {
        Loan_Scheme_Id="0"+LOAN_TYPE_ID.toString();
    }
    if(Loan_Scheme_Id_length==3)
    {
        Loan_Scheme_Id= LOAN_TYPE_ID.toString();
    }


    if(applicant_id_length==1)
    {
        appicant_id="0000"+APPLICANT_ID.toString();
    }
    if(applicant_id_length==2)
    {
        appicant_id="000"+APPLICANT_ID.toString();
    }
    if(applicant_id_length==3)
    {
        appicant_id="00"+APPLICANT_ID.toString();
    }
    if(applicant_id_length==4)
    {
        appicant_id="0"+APPLICANT_ID.toString();
    }
    if(applicant_id_length==5)
    {
        appicant_id=APPLICANT_ID.toString();
    }

    result= branch_code+Loan_Scheme_Id+appicant_id
    return result;



}

exports.diff_seconds = (dt2, dt1) => {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    return Math.abs(diff);

}

exports.executeQueryAsync = (query, supportKey) => {
    try {
        return new Promise((resolve, reject) => {
            dbConfig.getConnection(function (error, connection) {
                if (error) {
                    //console.log("11");
                    resolve({ error: error })
                }
                console.log(query);
                connection.query(query, (error, res) => {
                    if (error) {
                        //console.log("11");
                        resolve({ error: error })
                        // resolve(false)
                    }

                    console.log("res");
                    resolve(res)
                });
                connection.release();
                logger.database(query, applicationkey, supportKey);
            });
        });
    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
        return { error: error };
    } finally {
        //dbConfig.end();
    }
}

exports.executeQuery = (query, supportKey, callback) => {

    try {
    
	console.log(query)
          dbConfig.query(query, callback);
         	
    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
    } finally {
        //dbConfig.end();
    }
}

exports.executeQueryData = (query, data, supportKey, callback) => {

    try {
        dbConfig.getConnection(function (error, connection) {
            if (error) {
                console.log(error);
                //connection.release();
                throw error;
            }
            console.log(query, data);
            connection.query(query, data, callback);
            connection.on('error', function (error) {
                //conso
                throw error;
                return;
            });
            logger.database(query, applicationkey, supportKey);
            connection.release();
            // dbConfig.end();
        });
        //con.query(query, callback);
        //console.log(dbConfig.getDB().query(query));
        //if(JSON.stringify(query).startsWith('UPDATE'))
        //if (supportKey)
        //logger.database(supportKey + " " + query, supportKey);

    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
        // dbConfig.end();
    } finally {
        // dbConfig.end();
    }
}




exports.executeQueryTransaction = async (query, connection) => {

    try {

        return new Promise((resolve, reject) => {
            console.log(query);
            connection.query(query, (error, results) => {
                if (error) {
                    console.log(error);
                    this.rolbackConnection(connection);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
        this.rolbackConnection(connection);
        //dbConfig.end();
    } finally {
        // dbConfig.end();
    }
}

exports.executeQueryDataTransaction = (query, data, connection) => {
    try {
        return new Promise((resolve, reject) => {
            console.log(query, data);
            connection.query(query, data, (error, results) => {
                if (error) {
                    console.log(error);
                    this.rolbackConnection(connection);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
        this.rolbackConnection(connection);
        // dbConfig.end();
    } finally {
        //dbConfig.end();
    }
}


exports.getConnection = async () => {
    try {
        return new Promise(function (resolve, reject) {
            dbConfig.getConnection((error, connection) => {
                if (error) {
                    console.log("Error in getConnection : ", error);
                    reject(error);
                } else {
                    connection.beginTransaction(function (error) {
                        if (error) { //Transaction Error (Rollback and release connection)
                            connection.rollback(function () {
                                connection.release();
                                console.log("Error in beginTransaction : ", error);
                                reject(error);
                                //Failure
                            });
                        } else {
                            console.log(" Connection acquired. ");
                            resolve(connection);
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.log("Exception in getConnection : ", error);
    }
}


exports.endConnection = (connection) => {

    try {
        connection.commit(function (error) {
            if (error) {
                console.log("Error in Commit transanction : ", error);
                connection.rollback(function () {
                    connection.release();
                    //Failure
                });
            } else {
                console.log(" Connection Released. ");
                connection.release();
                //Success
            }
        });

    } catch (error) {
        console.log("Exception in endConnection : ", error);
    }
}



exports.rolbackConnection = (connection) => {
    try {
        connection.rollback(function () {
            console.log(" Connection Released. ");
            //connection.release();
        });
    } catch (error) {
        console.log("Exception in rollbackConnection : ", error);
    }
}


exports.recordPresent = async (connection, query) => {

    try {
        var results = await this.executeQuery1(query, connection);

        if (results.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("Exception in rollbackConnection : ", error);
    }
}


//getCurrentdate
exports.getSystemDate = function () {
    let date_ob = new Date();
    // current date 
    // adjust 0 before single digit date
    let day = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = ("0" + date_ob.getHours()).slice(-2);

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    date_cur = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    return date_cur;
}


exports.getTimeDate = function () {
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = ("0" + date_ob.getHours()).slice(-2);

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    date_cur = year + month + date + hours + minutes + seconds;

    return date_cur;
}

//get Intermediate dates 
exports.intermediateDates = function (startDate, endDate) {
    //console.log("intermediate" + startDate + " "+endDate);
    var startDatea = new Date(startDate); //YYYY-MM-DD
    var endDatea = new Date(endDate); //YYYY-MM-DD
    var getDateArray = function (start, end) {
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {

            var tempDate = new Date(dt);
            let date = ("0" + tempDate.getDate()).slice(-2);

            // current month
            let month = ("0" + (tempDate.getMonth() + 1)).slice(-2);

            // current year
            let year = tempDate.getFullYear();

            arr.push(year + "-" + month + "-" + date);
            dt.setDate(dt.getDate() + 1);
        }
        //console.log(arr);
        return arr;
    }

    var dateArr = getDateArray(startDatea, endDatea);
    return dateArr;
}


exports.generateKey = function (size) {

    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = size; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    console.log('length = ', result.length);
    return result;

}



//send SMS
exports.sendEmail = async (to, subject, body, callback) => {

    var request = require('request');

    console.log("email key ", process.env.EMAIL_SERVER_KEY)

    var options = {
        url: process.env.GM_API + 'sendEmail',
        headers: {
            "apikey": process.env.GM_API_KEY,
            "supportkey": process.env.SUPPORT_KEY,
            //"applicationkey": process.env.APPLICATION_KEY
        },
        body: {
            KEY: process.env.EMAIL_SERVER_KEY,
            TO: to,
            SUBJECT: subject,
            BODY: body
        },
        json: true
    }

    request.post(options, (error, response, body) => {
        if (error) {
            console.log("request error -send email ", error);
            //sms sent failed
            //data.STATUS = 'F';
            callback("EMAIL SEND ERROR.");
        } else {
            console.log(body);
            //sms sent  
            // CHECK STATUS FOR SENT SMS
            callback(null, "EMAIL SEND")
        }
    });
}


/// send sms 
exports.sendSMS = async (to, body, callback) => {
    const request = require('request');
    console.log("in sms send method");
    var options = {
        url: process.env.GM_API + 'sendSms',
        headers: {
            "apikey": process.env.GM_API_KEY,
            "supportkey": process.env.SUPPORT_KEY,
            "applicationkey": process.env.APPLICATION_KEY
        },
        body: {
            KEY: process.env.SMS_SERVER_KEY,
            TO: to,
            BODY: body
        },
        json: true
    };

    console.log(options);
    request.post(options, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            console.log("bdoy: ", response.body);
            if (response.body.code == 400)
                callback("SMS SEND ERROR.");
            else
                callback(null,"SMS SEND")
        }
    });
}




