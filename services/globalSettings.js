const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;




exports.getVersions = (req, res) => {


    try {
        console.log(req.body);
       var supportKey = req.headers['supportkey']
       // var minVersion = await mm.executeQueryAsync(`select VALUE from global_settings where KEYWORD = 'MIN_VERSION'`, supportKey);

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

                mm.executeQuery(`select VALUE from global_settings where KEYWORD = 'APK_LINK'`, supportKey,(error,resultsApplink)=>{
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
                                        APK_LINK:resultsApplink[0].VALUE
                                    }]
                                });
                            }
                        });     
                    }
                });
            }
        });
       
    } catch (error) {
        console.log(error);
    }
}

exports.getTermsConditions = (req, res) => {


    try {
        console.log(req.body);
       var supportKey = req.headers['supportkey']
       // var minVersion = await mm.executeQueryAsync(`select VALUE from global_settings where KEYWORD = 'MIN_VERSION'`, supportKey);

        mm.executeQuery(`select VALUE from global_settings where KEYWORD = 'TERMS_N_CONDITION_URL'`, supportKey,(error,resultsConditions)=>{
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
			console.log(resultsConditions[0].VALUE,'here');
                
                res.send({
                    "code": 200,
                    "message": "success",
                    "data":[{
                        "TERMS_N_CONDITION_URL":resultsConditions[0].VALUE,
                    }]
                });
            }
        });
       
    } catch (error) {
        console.log(error);
    }
}




exports.getAccountNumber = (req, res) => {
    try {
        console.log(req.body);
        var supportKey = req.headers['supportkey']
        // var minVersion = await mm.executeQueryAsync(`select VALUE from global_settings where KEYWORD = 'MIN_VERSION'`, supportKey);

        mm.executeQuery(`select VALUE from global_settings where KEYWORD = 'PAYMENT_ACCOUNT_NUMBER'`, supportKey, (error, resultsConditions) => {
            if (error) {
                console.log(error);
                // console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get users count.",
                });
            }
            else {

                mm.executeQuery(`select VALUE from global_settings where KEYWORD = 'PAYMENT_BRANCH_NAME'`, supportKey, (error, resultsConditions1) => {
                    if (error) {
                        console.log(error);
                        // console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                        res.send({
                            "code": 400,
                            "message": "Failed to get users count.",
                        });
                    }
                    else {
        
                        res.send({
                            "code": 200,
                            "message": "success",
                            "data": [{
                                "PAYMENT_BRANCH_NAME": resultsConditions1[0].VALUE,
                                "PAYMENT_ACCOUNT_NUMBER": resultsConditions[0].VALUE,
                            }]
                        });
                    }
                });
        

            }
        });

    } catch (error) {
        console.log(error);
    }
}


exports.getPagesInformation = (req, res) => {
    try {
        //console.log(req.body);
        var supportKey = req.headers['supportkey']
        // var minVersion = await mm.executeQueryAsync(`select VALUE from global_settings where KEYWORD = 'MIN_VERSION'`, supportKey);

        mm.executeQuery(`select VALUE from global_settings where KEYWORD in ('PAGE1', 'PAGE2','PAGE3','PAGE4','PAGE0','SUPPORT','BANK_NAME','BANK_ABOUT_URL')`, supportKey, (error, resultsConditions) => {
            if (error) {
                console.log(error);
                // console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get users count.",
                });
            }
            else {

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": [{
                        "PAGE1": resultsConditions[0].VALUE,
                        "PAGE2": resultsConditions[1].VALUE,
                        "PAGE3": resultsConditions[2].VALUE,
                        "PAGE4": resultsConditions[3].VALUE,
                        "PAGE0": resultsConditions[4].VALUE,
			 "SUPPORT": resultsConditions[5].VALUE,
"BANK_NAME": resultsConditions[6].VALUE,
 "BANK_ABOUT_URL": resultsConditions[7].VALUE
                    }]
                });
            }
        });

    } catch (error) {
        console.log(error);
    }
}


exports.updatePageInformation = (req,res) =>{

    try {
            var PAGE0 = req.body.PAGE0;
            var PAGE1 = req.body.PAGE1;
            var PAGE2 = req.body.PAGE2;
            var PAGE3 = req.body.PAGE3;
            var PAGE4 = req.body.PAGE4;
            var SUPPORT = req.body.SUPPORT;
            var supportKey = req.headers['supportkey'];

            if(PAGE0 && PAGE1 && PAGE2 && PAGE3 && PAGE4)
            {
           var connection= db.openConnection();

                db.executeDML(`update global_settings set VALUE = ? WHERE KEYWORD = 'PAGE0'`,[PAGE0], supportKey,connection, (error, resultscurVersion) => {
                    if (error) {
                        console.log(error);
                        //console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to get users count.",
                        });
                    }
                    else {
                        db.executeDML(`update global_settings set VALUE = ? WHERE KEYWORD = 'PAGE1'`,[PAGE1], supportKey,connection, (error, resultscurVersion) => {
                            if (error) {
                                console.log(error);
                                //console.log(error);
                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                db.rollbackConnection(connection);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to get users count.",
                                });
                            }
                            else {
                                db.executeDML(`update global_settings set VALUE = ? WHERE KEYWORD = 'PAGE2'`,[PAGE2], supportKey,connection, (error, resultscurVersion) => {
                                    if (error) {
                                        console.log(error);
                                        //console.log(error);
                                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                        db.rollbackConnection(connection);
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to get users count.",
                                        });
                                    }
                                    else {
                                        db.executeDML(`update global_settings set VALUE = ? WHERE KEYWORD = 'PAGE3'`,[PAGE3], supportKey,connection, (error, resultscurVersion) => {
                                            if (error) {
                                                console.log(error);
                                                //console.log(error);
                                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                                db.rollbackConnection(connection);
                                                res.send({
                                                    "code": 400,
                                                    "message": "Failed to get users count.",
                                                });
                                            }
                                            else {
                                                db.executeDML(`update global_settings set VALUE = ? WHERE KEYWORD = 'PAGE4'`,[PAGE4], supportKey,connection, (error, resultscurVersion) => {
                                                    if (error) {
                                                        console.log(error);
                                                        //console.log(error);
                                                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                                        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                                        db.rollbackConnection(connection);
                                                        res.send({
                                                            "code": 400,
                                                            "message": "Failed to get users count.",
                                                        });
                                                    }
                                                    else {
                                                        db.executeDML(`update global_settings set VALUE = ? WHERE KEYWORD = 'SUPPORT'`,[SUPPORT], supportKey,connection, (error, resultscurVersion) => {
                                                            if (error) {
                                                                console.log(error);
                                                                //console.log(error);
                                                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                                                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                                                                db.rollbackConnection(connection);
                                                                res.send({
                                                                    "code": 400,
                                                                    "message": "Failed to get users count.",
                                                                });
                                                            }
                                                            else {
                                                                db.commitConnection(connection);
                                                                res.send({
                                                                    "code": 200,
                                                                    "message": "Settings successfully updated....",
                                                                    
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
                });
            }else
            {
                res.send({
                    "code": 400,
                    "message": "Parameter missing -page0,page1,page2,page3,page 4",
                   
                });
            }

    } catch (error) {
        console.log(error)
    }

}


exports.getAppInfo = (req, res) => {
    try {
        console.log(req.body);
        var supportKey = req.headers['supportkey']
        // var minVersion = await mm.executeQueryAsync(`select VALUE from global_settings where KEYWORD = 'MIN_VERSION'`, supportKey);

        mm.executeQuery(`select VALUE from global_settings where KEYWORD in ("BANK_NAME_M","BANK_NAME_E","BANK_NAME_S","BANK_NAME_FULLE","BANK_PACKAGE","BANK_SHORT_NAME","BANK_ABOUT_URL","F_KEY") order by KEYWORD`, supportKey, (error, resultsMaxVersion) => {
            if (error) {
                console.log(error);
                // console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get users count.",
                });
            }
            else {
                res.send({
                    "code": 200,
                    "message": "success",
                    "data": [{
                        BANK_ABOUT_URL: resultsMaxVersion[0].VALUE,
                        BANK_NAME_E: resultsMaxVersion[1].VALUE,
                        BANK_NAME_FULLE: resultsMaxVersion[2].VALUE,
                        BANK_NAME_M: resultsMaxVersion[3].VALUE,
                        BANK_NAME_S: resultsMaxVersion[4].VALUE,
                        BANK_PACKAGE: resultsMaxVersion[5].VALUE,
                        BANK_SHORT_NAME: resultsMaxVersion[6].VALUE,
						F_KEY: resultsMaxVersion[7].VALUE
                    }]
                });



            }
        });
    } catch (error) {
        console.log(error);
    }
}

