const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');

const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var businessFirmInformation = "business_firm_information";
var viewBusinessFirmInformation = "view_" + businessFirmInformation;


function reqData(req) {

    var data = {
        INCOME_INFORMATION_ID: req.body.INCOME_INFORMATION_ID,
        NAME_OF_FIRM: req.body.NAME_OF_FIRM,
        NATURE_OF_FIRM: req.body.NATURE_OF_FIRM,
        ADDRESS_ID: req.body.ADDRESS_ID,
        NUMBER_OF_YEARS: req.body.NUMBER_OF_YEARS,
        OWNERSHIP_TYPE: req.body.OWNERSHIP_TYPE,
        IS_SHOP_ACT_LICENSE: req.body.IS_SHOP_ACT_LICENSE ? '1' : '0',
        IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR: req.body.IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR ? '1' : '0',
        IS_GST_REGISTARTION_CERTIFICATE: req.body.IS_GST_REGISTARTION_CERTIFICATE ? '1' : '0',
        IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY: req.body.IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY ? '1' : '0',
        IS_OTHER_LICENSE: req.body.IS_OTHER_LICENSE ? '1' : '0',
        OTHER_LICENSE_NAME: req.body.OTHER_LICENSE_NAME,
        CLIENT_ID: req.body.CLIENT_ID,
        GST_NUMBER: req.body.GST_NUMBER,
        SHOP_ACT_NUMBER: req.body.SHOP_ACT_NUMBER,
        OTHER_LICENSE_NUMBER: req.body.OTHER_LICENSE_NUMBER,
        TYPE: req.body.TYPE,
        IS_MSME_REGISTERED: req.body.IS_MSME_REGISTERED ? '1' : '0',
        MSME_REGISTRATION_NUMBER: req.body.MSME_REGISTRATION_NUMBER ? req.body.MSME_REGISTRATION_NUMBER : '',
        MSME_REGISTRATION_DATE: req.body.MSME_REGISTRATION_DATE,
        IS_INVOLVE_IN_MANUFACTURING_PROCESS: req.body.IS_INVOLVE_IN_MANUFACTURING_PROCESS ? '1' : '0',
        OWNER_NAME: req.body.OWNER_NAME,
        IS_RENT_AGREEMENT_DONE: req.body.IS_RENT_AGREEMENT_DONE ? '1' : '0',
        RENT_AGREEMENT_END_DATE: req.body.RENT_AGREEMENT_END_DATE,
        PRIME_COSTOMERS_DETAILS: req.body.PRIME_COSTOMERS_DETAILS,
        DETAILS_OF_WORK_ORDERS: req.body.DETAILS_OF_WORK_ORDERS ? req.body.DETAILS_OF_WORK_ORDERS : '',
 	CAPITAL: req.body.CAPITAL,
        TURNOVER_YEARLY: req.body.TURNOVER_YEARLY,
        INCOME_YEARLY: req.body.INCOME_YEARLY,
		YEARLY_EXPENDITURE: req.body.YEARLY_EXPENDITURE,
    }
    return data;
}


exports.validate = function () {
    return [

        body('INCOME_INFORMATION_ID').isInt(),
        body('NAME_OF_FIRM').optional(),
        body('NATURE_OF_FIRM').optional(),
        body('ADDRESS_ID').isInt().optional(),
        body('NUMBER_OF_YEARS').isInt().optional(),
        body('IS_SHOP_ACT_LICENSE').toInt().isInt().optional(),
        body('IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR').toInt().isInt().optional(),
        body('IS_GST_REGISTARTION_CERTIFICATE').toInt().isInt().optional(),
        body('IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY').toInt().isInt().optional(),
        body('IS_OTHER_LICENSE').toInt().isInt().optional(),
        body('IS_MSME_REGISTERED').toInt().isInt().optional(),
        body('IS_INVOLVE_IN_MANUFACTURING_PROCESS').toInt().isInt().optional(),
        body('IS_RENT_AGREEMENT_DONE').toInt().isInt().optional(),
        body('OWNERSHIP_TYPE', ' parameter missing').exists(),
        body('ID').optional(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewBusinessFirmInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get businessFirmInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewBusinessFirmInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get businessFirmInformation information."
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
    console.log(req.body);
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
            mm.executeQueryData('INSERT INTO ' + businessFirmInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save businessFirmInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "BusinessFirmInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + businessFirmInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update businessFirmInformation information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "BusinessFirmInformation information updated successfully...",
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





exports.addBusinessInfo = (req, res) => {
    try {

        var data = reqData(req);
        const errors = validationResult(req);
        var supportKey = req.headers['supportkey'];

        var detailsOfEmployee = req.body.DETAILS_OF_EMPLOYEE;
        var factoryUnitInfo = req.body.FACTORY_UNIT_INFORMATION;
        var manufacturingInfo = req.body.MANUFACTURING_INFORMATION;
        var managementOfSalesInfo = req.body.MANAGEMENT_OF_SALES;
        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        //console.log("datafirmInfo ",PROPOSAL_ID,req.body)
        var ID = req.body.ID;
        if (!errors.isEmpty()) {

            console.log(errors);
            res.send({
                "code": 422,
                "message": errors.errors
            });
        }
        else {
            var connection = db.openConnection();
            var criteria = {
                ID: req.body.ID,
            };
            if (ID) {

                var systemDate = mm.getSystemDate();
                var setData = "";
                var recordData = [];
                Object.keys(data).forEach(key => {

                    //data[key] ? setData += `${key}= '${data[key]}', ` : true;
                    // setData += `${key}= :"${key}", `;
                     setData += `${key}= ? , ` ;
                     recordData.push(data[key]) ;
                });

                db.executeDML(`UPDATE ` + businessFirmInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, connection, (error, results) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        console.log(error);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to update businessFirmInformation information."
                        });
                    }
                    else {
                        console.log(results);


                        db.executeDML(`DELETE FROM details_of_employee WHERE  BUSINESS_FIRM_INFORMATION_ID = ${criteria.ID} `, '', supportKey, connection, (error, resultsDeleteDetailsOfEmployee) => {
                            if (error) {
                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                db.rollbackConnection(connection);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                console.log(error);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to update businessFirmInformation information."
                                });
                            }
                            else {

                                if (detailsOfEmployee.length > 0) {
                                    var detailsOfEmployeequery = `INSERT INTO details_of_employee (FIRM_INFORMATION_ID,EMPLOYEE_CATEGORY,COUNT,EDUCATINALLY_QUALIFIED,CLIENT_ID,BUSINESS_FIRM_INFORMATION_ID) VALUES ?`;
                                    var detailsOfEmployeeData = [];

                                    for (let i = 0; i < detailsOfEmployee.length; i++) {
                                        const empDteailsData = detailsOfEmployee[i];

                                        var rec = [0, empDteailsData.EMPLOYEE_CATEGORY, empDteailsData.COUNT, empDteailsData.EDUCATINALLY_QUALIFIED, empDteailsData.CLIENT_ID, criteria.ID]

                                        detailsOfEmployeeData.push(rec);

                                    }


                                    db.executeDML(detailsOfEmployeequery, [detailsOfEmployeeData], supportKey, connection, (error, resultsDetailsOfEmployee) => {
                                        if (error) {
                                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                            db.rollbackConnection(connection);
                                            console.log(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update businessFirmInformation information."
                                            });
                                        }
                                        else {

                                            addBusinessInfo(PROPOSAL_ID, managementOfSalesInfo, connection, req, res, supportKey, criteria, factoryUnitInfo, manufacturingInfo)

                                        }
                                    });

                                }
                                else {
                                    addBusinessInfo(PROPOSAL_ID, managementOfSalesInfo, connection, req, res, supportKey, criteria, factoryUnitInfo, manufacturingInfo)
                                }
                            }
                        });

                    }
                });
            }
            else {
                db.executeDML('INSERT INTO ' + businessFirmInformation + ' SET ?', data, supportKey, connection, (error, resultsInsert) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        db.rollbackConnection(connection);
                        res.send({
                            "code": 400,
                            "message": "Failed to save businessFirmInformation information..."
                        });
                    }
                    else {
                        console.log(resultsInsert.insertId)
                        criteria.ID = resultsInsert.insertId;
                        console.log(resultsInsert.insertId)
                        db.executeDML(`DELETE FROM details_of_employee WHERE BUSINESS_FIRM_INFORMATION_ID = ${criteria.ID} `, '', supportKey, connection, (error, resultsDeleteDetailsOfEmployee) => {
                            if (error) {
                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                db.rollbackConnection(connection);
                                console.log(error);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to update businessFirmInformation information."
                                });
                            }
                            else {

                                if (detailsOfEmployee.length > 0) {
                                    var detailsOfEmployeequery = `INSERT INTO details_of_employee (FIRM_INFORMATION_ID,EMPLOYEE_CATEGORY,COUNT,EDUCATINALLY_QUALIFIED,CLIENT_ID,BUSINESS_FIRM_INFORMATION_ID) VALUES ?`;
                                    var detailsOfEmployeeData = [];

                                    for (let i = 0; i < detailsOfEmployee.length; i++) {
                                        const empDteailsData = detailsOfEmployee[i];

                                        var rec = [0, empDteailsData.EMPLOYEE_CATEGORY, empDteailsData.COUNT, empDteailsData.EDUCATINALLY_QUALIFIED, empDteailsData.CLIENT_ID, criteria.ID]

                                        detailsOfEmployeeData.push(rec);

                                    }


                                    db.executeDML(detailsOfEmployeequery, [detailsOfEmployeeData], supportKey, connection, (error, resultsDetailsOfEmployee) => {
                                        if (error) {
                                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                            db.rollbackConnection(connection);
                                            console.log(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update businessFirmInformation information."
                                            });
                                        }
                                        else {

                                            addBusinessInfo(PROPOSAL_ID, managementOfSalesInfo, connection, req, res, supportKey, criteria, factoryUnitInfo, manufacturingInfo)

                                        }
                                    });

                                }
                                else {
                                    addBusinessInfo(PROPOSAL_ID, managementOfSalesInfo, connection, req, res, supportKey, criteria, factoryUnitInfo, manufacturingInfo)
                                }
                            }
                        });
                    }
                });
            }
        }

    } catch (error) {
        console.log(error);
    }

}

var async = require('async');

function addBusinessInfo(PROPOSAL_ID, managementOfSalesInfo, connection, req, res, supportKey, criteria, factoryUnitInfo, manufacturingInfo) {
    try {
        db.executeDML(`DELETE FROM factory_unit_information WHERE  BUSINESS_FIRM_INFORMATION_ID = ${criteria.ID} `, '', supportKey, connection, (error, resultsfactoryUnitInfoDelete) => {
            if (error) {
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                console.log(error);
                res.send({
                    "code": 400,
                    "message": "Failed to update businessFirmInformation information."
                });
            }
            else {
                if (factoryUnitInfo.length > 0) {
                    var factoryUnitInfoquery = `INSERT INTO factory_unit_information (FIRM_INFORMATION_ID,EXISTING_LAND_AREA,EXISTING_CONSTRUCTION_AREA,PROPOSED_LAND_AREA,PROPOSED_CONSTRUCTION_AREA,TYPE_OF_FACTORY,IS_SUFFICIENT_AREA,IS_AVAILABILITY_OF_ELECTRICITY,IS_AVAILABILITY_OF_WATER,IS_AVAILABILITY_OF_TRANSPORT,IS_AVAILABILITY_OF_WORKERS,CLIENT_ID,BUSINESS_FIRM_INFORMATION_ID) VALUES ?`;
                    var factoryUnitInfoData = [];

                    for (let i = 0; i < factoryUnitInfo.length; i++) {
                        const factoryInfoData = factoryUnitInfo[i];

                        var rec = [0, factoryInfoData.EXISTING_LAND_AREA, factoryInfoData.EXISTING_CONSTRUCTION_AREA, factoryInfoData.PROPOSED_LAND_AREA, factoryInfoData.PROPOSED_CONSTRUCTION_AREA, factoryInfoData.TYPE_OF_FACTORY, factoryInfoData.IS_SUFFICIENT_AREA, factoryInfoData.IS_AVAILABILITY_OF_ELECTRICITY, factoryInfoData.IS_AVAILABILITY_OF_WATER, factoryInfoData.IS_AVAILABILITY_OF_TRANSPORT, factoryInfoData.IS_AVAILABILITY_OF_WORKERS, factoryInfoData.CLIENT_ID, criteria.ID]

                        factoryUnitInfoData.push(rec);

                    }

                    db.executeDML(factoryUnitInfoquery, [factoryUnitInfoData], supportKey, connection, (error, resultsFactoryUnitInfoInsert) => {
                        if (error) {
                            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            db.rollbackConnection(connection);
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to update businessFirmInformation information."
                            });
                        }
                        else {


                            db.executeDML(`DELETE FROM manufacturing_information WHERE  BUSINESS_FIRM_INFORMATION_ID = ${criteria.ID} `, '', supportKey, connection, (error, resultsManufacturingInfoDelete) => {
                                if (error) {
                                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                    db.rollbackConnection(connection);
                                    console.log(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to update businessFirmInformation information."
                                    });
                                }
                                else {

                                    if (manufacturingInfo.length > 0) {
                                        var manufacturingInfoquery = `INSERT INTO manufacturing_information (FIRM_INFORMATION_ID,NAME_OF_PRODUCT,USE_OF_PRODUCT_IN_DETAILS,IS_ANCILILLARY_PRODUCT,FINAL_USE_OF_PRODUCT,AVAILABILITY_OF_MARKET,PLACE_OF_MARKET,CLIENT_ID,BUSINESS_FIRM_INFORMATION_ID,DETAILS_OF_MANUFACTURING_PROCESS,DETAILS_OF_MANUFACTURED_PRODUCT,MANUFACTURED_PRODUCT_OTHER_INFO) VALUES ?`;
                                        var manufacturingInfoData1 = [];

                                        for (let i = 0; i < manufacturingInfo.length; i++) {
                                            const manufacturingInfoData = manufacturingInfo[i];

                                            var rec = [0, manufacturingInfoData.NAME_OF_PRODUCT, manufacturingInfoData.USE_OF_PRODUCT_IN_DETAILS, manufacturingInfoData.IS_ANCILILLARY_PRODUCT, manufacturingInfoData.FINAL_USE_OF_PRODUCT, manufacturingInfoData.AVAILABILITY_OF_MARKET, manufacturingInfoData.PLACE_OF_MARKET, manufacturingInfoData.CLIENT_ID, criteria.ID, manufacturingInfoData.DETAILS_OF_MANUFACTURING_PROCESS, manufacturingInfoData.DETAILS_OF_MANUFACTURED_PRODUCT, manufacturingInfoData.MANUFACTURED_PRODUCT_OTHER_INFO]

                                            manufacturingInfoData1.push(rec);

                                        }

                                        db.executeDML(manufacturingInfoquery, [manufacturingInfoData1], supportKey, connection, (error, resultsmanufacturingInfoInsert) => {
                                            if (error) {
                                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                console.log(error);
                                                db.rollbackConnection(connection);
                                                res.send({
                                                    "code": 400,
                                                    "message": "Failed to update businessFirmInformation information."
                                                });
                                            }
                                            else {

                                                addManagementOfSales(managementOfSalesInfo, connection, supportKey, res, req, criteria, PROPOSAL_ID)

                                            }
                                        });
                                    }
                                    else {

                                        addManagementOfSales(managementOfSalesInfo, connection, supportKey, res, req, criteria, PROPOSAL_ID)
                                    }

                                }
                            });

                        }
                    });
                }
                else {
                    addManagementOfSales(managementOfSalesInfo, connection, supportKey, res, req, criteria, PROPOSAL_ID)
                }

            }
        });
    } catch (error) {
        console.log(error)
    }
}




function addManagementOfSales(managementOfSalesInfo, connection, supportKey, res, req, criteria, PROPOSAL_ID) {
    try {

        db.executeDML(`DELETE FROM  address_information WHERE ID in (SELECT SHOWROOM_OR_DEPO_ADDRESS_ID FROM management_of_sales_information WHERE BUSINESS_FIRM_INFORMATION_ID = ?)`, [criteria.ID], supportKey, connection, (error, resultsManufacturingaddtessDelete) => {
            if (error) {
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                db.rollbackConnection(connection);
                console.log(error);
                res.send({
                    "code": 400,
                    "message": "Failed to update businessFirmInformation information."
                });
            }
            else {
                db.executeDML(`DELETE FROM management_of_sales_information WHERE BUSINESS_FIRM_INFORMATION_ID =? `, [criteria.ID], supportKey, connection, (error, resultsManufacturingInfoDelete) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        db.rollbackConnection(connection);
                        console.log(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to update businessFirmInformation information."
                        });
                    }
                    else {

                        async.eachSeries(managementOfSalesInfo, function iteratorOverElems(managementOfSalesInformationData, callback) {


                            var address = managementOfSalesInformationData.SHOWROOM_OR_DEPO_ADDRESS;

                            console.log(address);
                            if (managementOfSalesInformationData.IS_SHOWROOM_OR_DEPO_OWNED && address) {
                                db.executeDML(`INSERT INTO address_information(STATE,DISTRICT,TALUKA,VILLAGE,PINCODE,LANDMARK,BUILDING,HOUSE_NO,CLIENT_ID) VALUES (?,?,?,?,?,?,?,?,?)`, [address.STATE, address.DISTRICT, address.TALUKA, address.VILLAGE, address.PINCODE, address.LANDMARK, address.BUILDING, address.HOUSE_NO, address.CLIENT_ID], supportKey, connection, (error, resultsAddress1) => {
                                    if (error) {
                                        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                        // db.rollbackConnection(connection);
                                        console.log(error);
                                        callback(error);
                                        // res.send({
                                        //     "code": 400,
                                        //     "message": "Failed to update businessFirmInformation information."
                                        // });
                                    }
                                    else {
                                        var AddressId = resultsAddress1.insertId;


                                        var managementOfSalesInfoquery = `INSERT INTO management_of_sales_information (PROPOSAL_ID,AGENT_NAME,IS_SHOWROOM_OR_DEPO_OWNED,SHOWROOM_OR_DEPO_ADDRESS_ID,IS_SALE_DIRECT_TO_CUSTOMER,CUSTOMER_DETAILS,IS_EXPORT_SALES,EXPORT_DETAILS,CLIENT_ID,BUSINESS_FIRM_INFORMATION_ID) VALUES ?`;
                                        var managementOfSalesInfoData1 = [];


                                        var rec = [PROPOSAL_ID, managementOfSalesInformationData.AGENT_NAME, managementOfSalesInformationData.IS_SHOWROOM_OR_DEPO_OWNED, AddressId, managementOfSalesInformationData.IS_SALE_DIRECT_TO_CUSTOMER, managementOfSalesInformationData.CUSTOMER_DETAILS, managementOfSalesInformationData.IS_EXPORT_SALES, managementOfSalesInformationData.EXPORT_DETAILS, managementOfSalesInformationData.CLIENT_ID, criteria.ID]

                                        managementOfSalesInfoData1.push(rec);



                                        db.executeDML(managementOfSalesInfoquery, [managementOfSalesInfoData1], supportKey, connection, (error, resultsmanufacturingInfoInsert) => {
                                            if (error) {
                                                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                                // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                console.log(error);
                                                callback(error);

                                            }
                                            else {
                                                callback();


                                            }
                                        });


                                    }
                                });

                            }
                            else {


                                var managementOfSalesInfoquery = `INSERT INTO management_of_sales_information (PROPOSAL_ID,AGENT_NAME,IS_SHOWROOM_OR_DEPO_OWNED,SHOWROOM_OR_DEPO_ADDRESS_ID,IS_SALE_DIRECT_TO_CUSTOMER,CUSTOMER_DETAILS,IS_EXPORT_SALES,EXPORT_DETAILS,CLIENT_ID,BUSINESS_FIRM_INFORMATION_ID) VALUES ?`;
                                var managementOfSalesInfoData1 = [];


                                var rec = [PROPOSAL_ID, managementOfSalesInformationData.AGENT_NAME, managementOfSalesInformationData.IS_SHOWROOM_OR_DEPO_OWNED, 0, managementOfSalesInformationData.IS_SALE_DIRECT_TO_CUSTOMER, managementOfSalesInformationData.CUSTOMER_DETAILS, managementOfSalesInformationData.IS_EXPORT_SALES, managementOfSalesInformationData.EXPORT_DETAILS, managementOfSalesInformationData.CLIENT_ID, criteria.ID]

                                managementOfSalesInfoData1.push(rec);



                                db.executeDML(managementOfSalesInfoquery, [managementOfSalesInfoData1], supportKey, connection, (error, resultsmanufacturingInfoInsert) => {
                                    if (error) {
                                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                        console.log(error);
                                        callback(error);
                                        // db.rollbackConnection(connection);
                                        // res.send({
                                        //     "code": 400,
                                        //     "message": "Failed to update businessFirmInformation ."
                                        // });
                                    }
                                    else {
                                        callback();


                                    }
                                });


                            }
                        }, function subCb(err) {
                            if (err) {
                                //rollback
                                //db.rollbackConnection(connection);
                                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                console.log(error);
                                db.rollbackConnection(connection);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to update businessFirmInformation ."
                                });
                            } else {
                                //db.commitConnection(connection);
                                db.commitConnection(connection)
                                res.send({
                                    "code": 200,
                                    "message": "BusinessFirmInformation  updated successfully...",
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
