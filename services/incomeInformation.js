const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var incomeInformation = "income_information";
var viewIncomeInformation = "view_" + incomeInformation;

function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        INCOME_SOURCE_ID: req.body.INCOME_SOURCE_ID,
        OTHER_INCOME_SOURCE_ID: req.body.OTHER_INCOME_SOURCE_ID,
        IS_HOLD_AGRICULTURE_LAND: req.body.IS_HOLD_AGRICULTURE_LAND ? '1' : '0',

        CLIENT_ID: req.body.CLIENT_ID,
        OTHER_INCOME_SOURCE_ID2: req.body.OTHER_INCOME_SOURCE_ID2,
        IS_SAVED: req.body.IS_SAVED,
        TYPE: req.body.TYPE ? req.body.TYPE : '',
        APPLICANT_ID: req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0,
		OTHER_INCOME_SOURCE_ID3: req.body.OTHER_INCOME_SOURCE_ID3,
OTHER_INCOME_SOURCE_ID4: req.body.OTHER_INCOME_SOURCE_ID4,

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('INCOME_SOURCE_ID').isInt().optional(), body('OTHER_INCOME_SOURCE_ID').isInt().optional(), body('IS_HOLD_AGRICULTURE_LAND').optional(), body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewIncomeInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get incomeInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewIncomeInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get incomeInformation information."
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
            mm.executeQueryData('INSERT INTO ' + incomeInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save incomeInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "IncomeInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + incomeInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update incomeInformation information."
                    });
                }
                else {
                    console.log(results);
                    /*
                                         mm.executeQuery(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 2`, supportKey, (error, resultsUpdate) => {
                                            if (error) {
                                                //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                                                console.log(error);
                                                res.send({
                                                    "code": 400,
                                                    "message": "Failed to update Income Information."
                                                });
                                            }
                                            else {*/

                    res.send({
                        "code": 200,
                        "message": "Income Information updated successfully...",
                    });

                    //  }
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




exports.getAllIncomeInformation = (req, res) => {
    try {

        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportkey'];
        var TYPE = req.body.TYPE ? req.body.TYPE : '';
        var APPLICANT_ID = req.body.APPLICANT_ID ? req.body.APPLICANT_ID : 0;

        if (PROPOSAL_ID) {

            var query = `SET SESSION group_concat_max_len = 4294967290;
            SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'PROPOSAL_ID',PROPOSAL_ID,'INCOME_SOURCE_ID',INCOME_SOURCE_ID,'OTHER_INCOME_SOURCE_ID',OTHER_INCOME_SOURCE_ID,'OTHER_INCOME_SOURCE_ID2',OTHER_INCOME_SOURCE_ID2,'IS_SAVED',IS_SAVED,'IS_HOLD_AGRICULTURE_LAND',IS_HOLD_AGRICULTURE_LAND,'CLIENT_ID',CLIENT_ID,
              'SALARIED_INFORMATION',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'PROVIDANT_FUND',PROVIDANT_FUND,'INSURANCE',INSURANCE,'INCOME_TAX',INCOME_TAX,'LOAN_INSTALLMENT',LOAN_INSTALLMENT,'OTHER_DEDUCTION',OTHER_DEDUCTION,'INCOME_INFORMATION_ID',INCOME_INFORMATION_ID,'PLACE_OF_EMPLOYMENT',PLACE_OF_EMPLOYMENT,'ORGANISATION_NAME',ORGANISATION_NAME,'CONTACT_NO_OF_EMPLOYER',CONTACT_NO_OF_EMPLOYER,'POST_OF_EMPLOYMENT',POST_OF_EMPLOYMENT,'TYPE_OF_SECTOR',TYPE_OF_SECTOR,'TYPE_OF_EMPLOYMENT',TYPE_OF_EMPLOYMENT,'IS_PROVIDENT_FUND_DEDUCTED',IS_PROVIDENT_FUND_DEDUCTED,'JOINING_DATE',JOINING_DATE,'RETIREMENT_DATE',RETIREMENT_DATE,'LATEST_SALARY_MONTH',LATEST_SALARY_MONTH,'LATEST_SALARY_MONTH',LATEST_SALARY_MONTH,'GROSS_SALARY',GROSS_SALARY,'TOTAL_DEDUCTION',TOTAL_DEDUCTION,'NET_SALARY',NET_SALARY,'SALARY_PAID_TYPE',SALARY_PAID_TYPE,'IS_LETTER_FOR_LOAN_DEDUCTION',IS_LETTER_FOR_LOAN_DEDUCTION,'APPLICANT_DOCUMENTS_ID',APPLICANT_DOCUMENTS_ID,'BANK_NAME',BANK_NAME,'BRANCH_NAME',BRANCH_NAME,'IFSC_CODE',IFSC_CODE,'CLIENT_ID',CLIENT_ID,'ADDRESS',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data5 FROM view_address_information where ID = i.PLACE_OF_EMPLOYMENT ),'[]'))),']'),'"[','['),']"',']') as data6 FROM view_salaried_information i where INCOME_INFORMATION_ID = m.ID),'[]')),					
              'BUSINESS_FIRM_INFORMATION',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('CAPITAL',CAPITAL,'TURNOVER_YEARLY',TURNOVER_YEARLY,'INCOME_YEARLY',INCOME_YEARLY,'ID',ID,'TYPE',TYPE,'INCOME_INFORMATION_ID',INCOME_INFORMATION_ID,'NAME_OF_FIRM',NAME_OF_FIRM,'NATURE_OF_FIRM',NATURE_OF_FIRM,'ADDRESS_ID',ADDRESS_ID,'NUMBER_OF_YEARS',NUMBER_OF_YEARS,'OWNERSHIP_TYPE',OWNERSHIP_TYPE,'IS_SHOP_ACT_LICENSE',IS_SHOP_ACT_LICENSE,'IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR',IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR,'IS_GST_REGISTARTION_CERTIFICATE',IS_GST_REGISTARTION_CERTIFICATE,'IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY',IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY,'IS_OTHER_LICENSE',IS_OTHER_LICENSE,'OTHER_LICENSE_NAME',OTHER_LICENSE_NAME,'CLIENT_ID',CLIENT_ID,'GST_NUMBER',GST_NUMBER,'SHOP_ACT_NUMBER',SHOP_ACT_NUMBER,'OTHER_LICENSE_NUMBER',OTHER_LICENSE_NUMBER,'IS_MSME_REGISTERED',IS_MSME_REGISTERED,'MSME_REGISTRATION_NUMBER',MSME_REGISTRATION_NUMBER,'MSME_REGISTRATION_DATE',MSME_REGISTRATION_DATE,'IS_INVOLVE_IN_MANUFACTURING_PROCESS',IS_INVOLVE_IN_MANUFACTURING_PROCESS,'OWNER_NAME',OWNER_NAME,'IS_RENT_AGREEMENT_DONE',IS_RENT_AGREEMENT_DONE,'RENT_AGREEMENT_END_DATE',RENT_AGREEMENT_END_DATE,'PRIME_COSTOMERS_DETAILS',PRIME_COSTOMERS_DETAILS,'DETAILS_OF_WORK_ORDERS',DETAILS_OF_WORK_ORDERS,
                                  'ADDRESS',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data4 FROM view_address_information where ID = l.ADDRESS_ID ),'[]'),
                                  'DETAILS_OF_EMPLOYEE',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'EMPLOYEE_CATEGORY',EMPLOYEE_CATEGORY,'COUNT',COUNT,'EDUCATINALLY_QUALIFIED',EDUCATINALLY_QUALIFIED,'ARCHIVE_FLAG',ARCHIVE_FLAG,'CLIENT_ID',CLIENT_ID,'BUSINESS_FIRM_INFORMATION_ID',BUSINESS_FIRM_INFORMATION_ID)),']'),'"[','['),']"',']') as data4 FROM view_details_of_employee where BUSINESS_FIRM_INFORMATION_ID = l.ID ),'[]'),										
                                  'FACTORY_UNIT_INFORMATION',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'EXISTING_LAND_AREA',EXISTING_LAND_AREA,'EXISTING_CONSTRUCTION_AREA',EXISTING_CONSTRUCTION_AREA,'PROPOSED_LAND_AREA',PROPOSED_LAND_AREA,'PROPOSED_CONSTRUCTION_AREA',PROPOSED_CONSTRUCTION_AREA,'TYPE_OF_FACTORY',TYPE_OF_FACTORY,'IS_SUFFICIENT_AREA',IS_SUFFICIENT_AREA,'IS_AVAILABILITY_OF_ELECTRICITY',IS_AVAILABILITY_OF_ELECTRICITY,'IS_AVAILABILITY_OF_TRANSPORT',IS_AVAILABILITY_OF_TRANSPORT,'IS_AVAILABILITY_OF_WORKERS',IS_AVAILABILITY_OF_WORKERS,'BUSINESS_FIRM_INFORMATION_ID',BUSINESS_FIRM_INFORMATION_ID,'ARCHIVE_FLAG',ARCHIVE_FLAG,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data4 FROM view_factory_unit_information where BUSINESS_FIRM_INFORMATION_ID = l.ID ),'[]'),										
                                  'MANUFACTURING_INFORMATION',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'NAME_OF_PRODUCT',NAME_OF_PRODUCT,'USE_OF_PRODUCT_IN_DETAILS',USE_OF_PRODUCT_IN_DETAILS,'IS_ANCILILLARY_PRODUCT',IS_ANCILILLARY_PRODUCT,'FINAL_USE_OF_PRODUCT',FINAL_USE_OF_PRODUCT,'AVAILABILITY_OF_MARKET',AVAILABILITY_OF_MARKET,'PLACE_OF_MARKET',PLACE_OF_MARKET,'ARCHIVE_FLAG',ARCHIVE_FLAG,'BUSINESS_FIRM_INFORMATION_ID',BUSINESS_FIRM_INFORMATION_ID,'DETAILS_OF_MANUFACTURING_PROCESS',DETAILS_OF_MANUFACTURING_PROCESS,'DETAILS_OF_MANUFACTURED_PRODUCT',DETAILS_OF_MANUFACTURED_PRODUCT,'MANUFACTURED_PRODUCT_OTHER_INFO',MANUFACTURED_PRODUCT_OTHER_INFO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data4 FROM view_manufacturing_information where BUSINESS_FIRM_INFORMATION_ID = l.ID ),'[]'),
																	
																	'MANAGEMENT_OF_SALES',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'PROPOSAL_ID',PROPOSAL_ID,'AGENT_NAME',AGENT_NAME,'IS_SHOWROOM_OR_DEPO_OWNED',IS_SHOWROOM_OR_DEPO_OWNED,'SHOWROOM_OR_DEPO_ADDRESS_ID',SHOWROOM_OR_DEPO_ADDRESS_ID,'IS_SALE_DIRECT_TO_CUSTOMER',IS_SALE_DIRECT_TO_CUSTOMER,'CUSTOMER_DETAILS',CUSTOMER_DETAILS,'IS_EXPORT_SALES',IS_EXPORT_SALES,'EXPORT_DETAILS',EXPORT_DETAILS,'CLIENT_ID',CLIENT_ID,'BUSINESS_FIRM_INFORMATION_ID',BUSINESS_FIRM_INFORMATION_ID,'ADDRESS',IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_address_information where ID = d.SHOWROOM_OR_DEPO_ADDRESS_ID ),'[]'))),']'),'"[','['),']"',']') as data FROM view_management_of_sales_information d where BUSINESS_FIRM_INFORMATION_ID = l.ID ),'[]')
																	
																	
              )),']'),'"[','['),']"',']') as data3 FROM view_business_firm_information l where INCOME_INFORMATION_ID = m.ID),'[]')),							
              'AGRICULTURE_LAND_INFORMATION',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('AKAR_RS',AKAR_RS,'REMARKS',REMARKS,'ID',ID,'INCOME_INFORMATION_ID',INCOME_INFORMATION_ID,'PERSON_NAME',PERSON_NAME,'IS_NAME_APPEAR_IN_7_12',IS_NAME_APPEAR_IN_7_12,'TOTAL_AREA_OF_LAND',TOTAL_AREA_OF_LAND,'TOTAL_AREA_IN_APPLICANT_NAME',TOTAL_AREA_IN_APPLICANT_NAME,'PLACE_OF_AGRICULTURE_LAND',PLACE_OF_AGRICULTURE_LAND,'DETAILED_ADDRESS_ID',DETAILED_ADDRESS_ID,'TOTAL_AREA_OF_LAND_AS_PER_8A',TOTAL_AREA_OF_LAND_AS_PER_8A,'TOTAL_AREA_IN_APPLICANT_NAME_AS_PER_8A',TOTAL_AREA_IN_APPLICANT_NAME_AS_PER_8A,'TYPE_OF_AGRICULTURE_LAND',TYPE_OF_AGRICULTURE_LAND,'CURRENT_AGRICULTURE_PRODUCT',CURRENT_AGRICULTURE_PRODUCT,'ANNUAL_INCOME_FROM_THIS_LAND',ANNUAL_INCOME_FROM_THIS_LAND,'PROPERTY_INFO_ID',PROPERTY_INFO_ID,'CLIENT_ID',CLIENT_ID,'ADDRESS',IFNULL(( SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data2 FROM view_address_information where ID = k.DETAILED_ADDRESS_ID ),'[]'))),']'),'"[','['),']"',']') as data1 FROM view_agriculture_land_information k where INCOME_INFORMATION_ID = m.ID),'[]'))
              )),']'),'"[','['),']"',']') as data FROM view_income_information m where PROPOSAL_ID =${PROPOSAL_ID} AND TYPE = '${TYPE}' ` + (APPLICANT_ID ? `AND APPLICANT_ID = ${APPLICANT_ID}` : ``);



            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get all income information."
                    });
                }
                else {
                    var json = results[1][0].data
                    if (json)
                        json = json.replace(/\\/g, '');
                    console.log(json);
                    res.send({
                        code: 200,
                        message: "success",
                        data: JSON.parse(json)
                    })
                }
            })
        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter Missing - ProposalId"
            });

        }
    } catch (error) {
        console.log(error);
    }
}
