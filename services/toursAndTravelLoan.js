const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var toursAndTravelLoan = "tours_and_travel_loan";
var viewToursAndTravelLoan = "view_" + toursAndTravelLoan;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        TOTAL_FAMILY_MEMBERS_TO_TRAVELS: req.body.TOTAL_FAMILY_MEMBERS_TO_TRAVELS,
        TRAVELLING_PLACE_NAME: req.body.TRAVELLING_PLACE_NAME,
        TRAVELING_PLACE: req.body.TRAVELING_PLACE,
        TRAVELLING_TIME: req.body.TRAVELLING_TIME,
        TRAVELLING_START_DATE: req.body.TRAVELLING_START_DATE,
        TRAVELLING_RETURN_DATE: req.body.TRAVELLING_RETURN_DATE,
        IS_TRAVELLING_SELF_OR_TRAVELLING_AGENCY: req.body.IS_TRAVELLING_SELF_OR_TRAVELLING_AGENCY,
        TRAVEL_AGENCY_NAME: req.body.TRAVEL_AGENCY_NAME,
        TRAVEL_AGENCY_QUOTATION_AMOUNT: req.body.TRAVEL_AGENCY_QUOTATION_AMOUNT ? req.body.TRAVEL_AGENCY_QUOTATION_AMOUNT : 0,
        IS_GIVE_ADVANCE_AMOUNT_TO_TRAVEL_AGENCY: req.body.IS_GIVE_ADVANCE_AMOUNT_TO_TRAVEL_AGENCY ? '1' : '0',
        ADVANCE_AMOUNT: req.body.ADVANCE_AMOUNT ? req.body.ADVANCE_AMOUNT : 0,
        IS_LTC_PROVIDED: req.body.IS_LTC_PROVIDED ? '1' : '0',
        MEANS_OF_TRAVELS: req.body.MEANS_OF_TRAVELS,
        FROM_LOCATION: req.body.FROM_LOCATION,
        TO_LOCATION: req.body.TO_LOCATION,
        TRAVEL_DATE: req.body.TRAVEL_DATE,
        TRAVELS_INSURENCE_DETAILS: req.body.TRAVELS_INSURENCE_DETAILS,
        IS_TICKET_TAKEN: req.body.IS_TICKET_TAKEN ? '1' : '0',

        CLIENT_ID: req.body.CLIENT_ID

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(),
        body('TOTAL_FAMILY_MEMBERS_TO_TRAVELS').isInt(),
        body('TRAVELLING_PLACE_NAME', ' parameter missing').exists(),
        body('TRAVELING_PLACE', ' parameter missing').exists(),
        body('TRAVELLING_TIME').isInt(),
        body('TRAVELLING_START_DATE', ' parameter missing').exists(),
        body('TRAVELLING_RETURN_DATE', ' parameter missing').exists(),
        body('IS_TRAVELLING_SELF_OR_TRAVELLING_AGENCY', ' parameter missing').exists(),
        body('TRAVEL_AGENCY_NAME', ' parameter missing').exists(),
        body('TRAVEL_AGENCY_QUOTATION_AMOUNT').isDecimal(),
        body('ADVANCE_AMOUNT').isDecimal(),
        body('MEANS_OF_TRAVELS', ' parameter missing').exists(),
        body('FROM_LOCATION').optional(),
        body('TO_LOCATION').optional(),
        body('TRAVEL_DATE').optional(),
        body('TRAVELS_INSURENCE_DETAILS').optional(),
        body('ID').optional(),

        body('IS_GIVE_ADVANCE_AMOUNT_TO_TRAVEL_AGENCY').optional().toInt().isInt(),
        body('IS_LTC_PROVIDED').optional().toInt().isInt(),
        body('IS_TICKET_TAKEN').optional().toInt().isInt(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewToursAndTravelLoan + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get toursAndTravelLoan count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewToursAndTravelLoan + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get toursAndTravelLoan information."
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
            mm.executeQueryData('INSERT INTO ' + toursAndTravelLoan + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save toursAndTravelLoan information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ToursAndTravelLoan information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + toursAndTravelLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update toursAndTravelLoan information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "ToursAndTravelLoan information updated successfully...",
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






exports.addToursAndTravelsDetails1 = (req, res) => {
    try {

        const errors = validationResult(req);
        //console.log(req.body);
        var data = reqData(req);

        var toursDetails = req.body.TOURS_DETAILS;

        var supportKey = req.headers['supportkey'];
        var criteria = {
            ID: req.body.ID,
        };

        if (!errors.isEmpty()) {
            console.log(errors);
            res.send({
                "code": 422,
                "message": errors.errors
            });
        }
        else {
            var connection = db.openConnection();
            if (criteria.ID) {
                var systemDate = mm.getSystemDate();
                var setData = "";
                var recordData = [];
                Object.keys(data).forEach(key => {
                    data[key] ? setData += `${key}= ? , ` : true;
                    data[key] ? recordData.push(data[key]) : true;
                });
                db.executeDML(`UPDATE ` + toursAndTravelLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, resultsUpdate) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update toursAndTravelLoan information."
                        });
                    }
                    else {
                        //console.log(results);

                        if (data.TRAVELING_PLACE == 'F' && toursDetails.length > 0) {
                            updateForeignMembersDetalis(req, res, supportKey, connection, criteria.ID, toursDetails)
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "ToursAndTravelLoan information updated successfully...",
                            });
                        }

                    }
                });
            }
            else {
                db.executeDML('INSERT INTO ' + toursAndTravelLoan + ' SET ?', data, supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save toursAndTravelLoan information..."
                        });
                    }
                    else {
                        //console.log(results);

                        if (data.TRAVELING_PLACE == 'F' && toursDetails.length > 0) {
                            updateForeignMembersDetalis(req, res, supportKey, connection, resultsInsert.insertId, toursDetails)
                        }
                        else {
                            db.commitConnection(connection);
                            res.send({
                                "code": 200,
                                "message": "ToursAndTravelLoan information updated successfully...",
                            });
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}




function updateForeignMembersDetalis1(req, res, supportKey, connection, TOUR_AND_TRAVELS_LOAN_ID, toursDetails) {
    try {

        db.executeDML(`DELETE FROM foreign_travel_family_detail WHERE TOUR_AND_TRAVELS_LOAN_ID = ${TOUR_AND_TRAVELS_LOAN_ID}`, '', supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save toursAndTravelLoan information..."
                });
            }
            else {

                var insertQuery = `Insert into foreign_travel_family_detail( TOUR_AND_TRAVELS_LOAN_ID,NAME,PASSPORT_NUMBER,PASSPORT_VALIDITY_DATE,VISA_COUNTRY_NAME,VISA_TYPE,VISA_VALIDITY,IS_TAKEN_INSURANCE,CLIENT_ID) values ?`

                var recordData = [];

                for (let i = 0; i < toursDetails.length; i++) {
                    const dataItem = toursDetails[i];

                    var rec = [TOUR_AND_TRAVELS_LOAN_ID, dataItem.NAME, dataItem.PASSPORT_NUMBER, dataItem.PASSPORT_VALIDITY_DATE, dataItem.VISA_COUNTRY_NAME, dataItem.VISA_TYPE, dataItem.VISA_VALIDITY, dataItem.IS_TAKEN_INSURANCE, dataItem.CLIENT_ID]

                    recordData.push(rec);

                }

                db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save toursAndTravelLoan information..."
                        });
                    }
                    else {
                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "ToursAndTravelLoan information updated successfully...",
                        });
                    }
                });
            }
        });

    } catch (error) {
        console.log(error)
    }
}







exports.addToursAndTravelsDetails = (req, res) => {
    try {

        const errors = validationResult(req);
        //console.log(req.body);
        var data = reqData(req);

        var toursDetails = req.body.TOURS_DETAILS;
        var travelsDetails = req.body.TRAVELLING_DETAILS_INFORMATION;

        var supportKey = req.headers['supportkey'];
        var criteria = {
            ID: req.body.ID,
        };

        if (!errors.isEmpty()) {
            console.log(errors);
            res.send({
                "code": 422,
                "message": errors.errors
            });
        }
        else {
            var connection = db.openConnection();
            if (criteria.ID) {
                var systemDate = mm.getSystemDate();
                var setData = "";
                var recordData = [];
                Object.keys(data).forEach(key => {
                    data[key] ? setData += `${key}= ? , ` : true;
                    data[key] ? recordData.push(data[key]) : true;
                });
                db.executeDML(`UPDATE ` + toursAndTravelLoan + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, resultsUpdate) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update toursAndTravelLoan information."
                        });
                    }
                    else {
                        //console.log(results);

                        if (data.TRAVELING_PLACE == 'F' && toursDetails.length > 0) {
                            updateForeignMembersDetalis(req, res, supportKey, connection, criteria.ID, toursDetails, travelsDetails)
                        }
                        else {
                            updateToursDetails(req, res, supportKey, connection, criteria.ID, travelsDetails)
                        }

                    }
                });
            }
            else {
                db.executeDML('INSERT INTO ' + toursAndTravelLoan + ' SET ?', data, supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save toursAndTravelLoan information..."
                        });
                    }
                    else {
                        //console.log(results);

                        if (data.TRAVELING_PLACE == 'F' && toursDetails.length > 0) {
                            updateForeignMembersDetalis(req, res, supportKey, connection, resultsInsert.insertId, toursDetails, travelsDetails)
                        }
                        else {
                            updateToursDetails(req, res, supportKey, connection, resultsInsert.insertId, travelsDetails)
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}




function updateForeignMembersDetalis(req, res, supportKey, connection, TOUR_AND_TRAVELS_LOAN_ID, toursDetails, travelsDetails) {
    try {

        db.executeDML(`DELETE FROM foreign_travel_family_detail WHERE TOUR_AND_TRAVELS_LOAN_ID = ${TOUR_AND_TRAVELS_LOAN_ID}`, '', supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save toursAndTravelLoan information..."
                });
            }
            else {

                var insertQuery = `Insert into foreign_travel_family_detail( TOUR_AND_TRAVELS_LOAN_ID,NAME,PASSPORT_NUMBER,PASSPORT_VALIDITY_DATE,VISA_COUNTRY_NAME,VISA_TYPE,VISA_VALIDITY,IS_TAKEN_INSURANCE,CLIENT_ID) values ?`

                var recordData = [];

                for (let i = 0; i < toursDetails.length; i++) {
                    const dataItem = toursDetails[i];

                    var rec = [TOUR_AND_TRAVELS_LOAN_ID, dataItem.NAME, dataItem.PASSPORT_NUMBER, dataItem.PASSPORT_VALIDITY_DATE, dataItem.VISA_COUNTRY_NAME, dataItem.VISA_TYPE, dataItem.VISA_VALIDITY, dataItem.IS_TAKEN_INSURANCE, dataItem.CLIENT_ID]

                    recordData.push(rec);

                }

                db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save toursAndTravelLoan information..."
                        });
                    }
                    else {
                        updateToursDetails(req, res, supportKey, connection, TOUR_AND_TRAVELS_LOAN_ID, travelsDetails)
                    }
                });
            }
        });

    } catch (error) {
        console.log(error)
    }
}




function updateToursDetails(req, res, supportKey, connection, TOUR_AND_TRAVELS_LOAN_ID, toursDetails) {
    try {

        db.executeDML(`DELETE FROM travelling_details_information WHERE TOUR_AND_TRAVELS_LOAN_ID = ${TOUR_AND_TRAVELS_LOAN_ID}`, '', supportKey, connection, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                res.send({
                    "code": 400,
                    "message": "Failed to save travellingDetailsInformation information..."
                });
            }
            else {

                var insertQuery = `Insert into travelling_details_information( TOUR_AND_TRAVELS_LOAN_ID,MEANS_OF_TRAVELS,FROM_LOCATION,TO_LOCATION,TRAVEL_DATE,TRAVELS_INSURENCE_DETAILS,IS_TICKET_TAKEN,TICKET_AMOUNT,CLIENT_ID) values ?`

                var recordData = [];

                for (let i = 0; i < toursDetails.length; i++) {
                    const dataItem = toursDetails[i];

                    var rec = [TOUR_AND_TRAVELS_LOAN_ID, dataItem.MEANS_OF_TRAVELS, dataItem.FROM_LOCATION, dataItem.TO_LOCATION, dataItem.TRAVEL_DATE, dataItem.TRAVELS_INSURENCE_DETAILS, dataItem.IS_TICKET_TAKEN, dataItem.TICKET_AMOUNT, dataItem.CLIENT_ID]

                    recordData.push(rec);

                }

                db.executeDML(insertQuery, [recordData], supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save travellingDetailsInformation information..."
                        });
                    }
                    else {
                        db.commitConnection(connection);
                        res.send({
                            "code": 200,
                            "message": "TravellingDetailsInformation information updated successfully...",
                        });
                    }
                });
            }
        });

    } catch (error) {
        console.log(error)
    }
}








