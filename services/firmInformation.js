
const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var firmInformation = "firm_information";
var viewFirmInformation = "view_" + firmInformation;


function reqData(req) {

    var data = {
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        NAME_OF_FIRM: req.body.NAME_OF_FIRM,
        NATURE_OF_BUSINESS: req.body.NATURE_OF_BUSINESS,
        CONSTITUTION_OF_FIRM: req.body.CONSTITUTION_OF_FIRM,
        IS_MSME_REGISTERED: req.body.IS_MSME_REGISTERED ? '1' : '0',
        MSME_REGISTRATION_NUMBER: req.body.MSME_REGISTRATION_NUMBER,
        MSME_REGISTRATION_DATE: req.body.MSME_REGISTRATION_DATE,
        IS_INVOLVE_IN_MANUFACTURING_PROCESS: req.body.IS_INVOLVE_IN_MANUFACTURING_PROCESS ? '1' : '0',

        DATE_OF_REGISTRATION: req.body.DATE_OF_REGISTRATION,
        REGISTRATION_NUMBER: req.body.REGISTRATION_NUMBER,
        PAN_NUMBER_OF_FIRM: req.body.PAN_NUMBER_OF_FIRM,
        REGISTERED_OFFICE_ADDRESS_ID: req.body.REGISTERED_OFFICE_ADDRESS_ID,
        IS_ANOTHER_BRANCH: req.body.IS_ANOTHER_BRANCH ? '1' : '0',
        ANOTHER_BRANCH_ADDRESS_ID: req.body.ANOTHER_BRANCH_ADDRESS_ID ? req.body.ANOTHER_BRANCH_ADDRESS_ID : '0',
        OWNERSHIP_OF_BUSINESS: req.body.OWNERSHIP_OF_BUSINESS,
        IS_SHOP_ACT_LICENSE: req.body.IS_SHOP_ACT_LICENSE ? '1' : '0',
        IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR: req.body.IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR ? '1' : '0',
        IS_GST_REGISTARTION_CERTIFICATE: req.body.IS_GST_REGISTARTION_CERTIFICATE ? '1' : '0',
        IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY: req.body.IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY ? '1' : '0',
        IS_OTHER_LICENSE: req.body.IS_OTHER_LICENSE ? '1' : '0',
        OTHER_LICENSE_NAME: req.body.OTHER_LICENSE_NAME,
        LANDLINE_NUMBER: req.body.LANDLINE_NUMBER,
        EMAIL_ID: req.body.EMAIL_ID,
        IS_SISTER_OR_ASSOCIATE_CONSERN: req.body.IS_SISTER_OR_ASSOCIATE_CONSERN ? '1' : '0',
        IS_ANY_CHANGE_IN_CONSTITUENTS: req.body.IS_ANY_CHANGE_IN_CONSTITUENTS ? '1' : '0',
        CHANGE_IN_CONSTITUENTS_DETAILS: req.body.CHANGE_IN_CONSTITUENTS_DETAILS,
        PRIME_COSTOMERS_DETAILS: req.body.PRIME_COSTOMERS_DETAILS,
        DETAILS_OF_WORK_ORDERS: req.body.DETAILS_OF_WORK_ORDERS,
        GST_NUMBER: req.body.GST_NUMBER,
        SHOP_ACT_NUMBER: req.body.SHOP_ACT_NUMBER,
        OTHER_LICENSE_NUMBER: req.body.OTHER_LICENSE_NUMBER,
        IS_PARTNERS: req.body.IS_PARTNERS ? '1' : '0',
        CLIENT_ID: req.body.CLIENT_ID,

        OWNER_NAME: req.body.OWNER_NAME,
        IS_RENT_AGREEMENT_DONE: req.body.IS_RENT_AGREEMENT_DONE ? '1' : '0',
        RENT_AGREEMENT_END_DATE: req.body.RENT_AGREEMENT_END_DATE,

        NEW_DIRECTORS_PARTNERS_TRUSTEE_INFO: req.body.NEW_DIRECTORS_PARTNERS_TRUSTEE_INFO,
        OLD_DIRECTORS_PARTNERS_TRUSTEE_INFO: req.body.OLD_DIRECTORS_PARTNERS_TRUSTEE_INFO,

    }
    return data;
}



exports.validate = function () {
    return [

        body('PROPOSAL_ID').isInt(), body('NAME_OF_FIRM').optional(), body('NATURE_OF_BUSINESS').optional(), body('CONSTITUTION_OF_FIRM').optional(), body('MSME_REGISTRATION_NUMBER').optional(), body('MSME_REGISTRATION_DATE').optional(), body('DATE_OF_REGISTRATION').optional(), body('REGISTRATION_NUMBER').optional(), body('PAN_NUMBER_OF_FIRM').optional(), body('REGISTERED_OFFICE_ADDRESS_ID').isInt().optional(), body('ANOTHER_BRANCH_ADDRESS_ID').isInt().optional(), body('OWNERSHIP_OF_BUSINESS').optional(), body('OTHER_LICENSE_NAME').optional(), body('LANDLINE_NUMBER').optional(), body('EMAIL_ID').optional(), body('CHANGE_IN_CONSTITUENTS_DETAILS').optional(), body('PRIME_COSTOMERS_DETAILS').optional(), body('DETAILS_OF_WORK_ORDERS').optional(), body('ID').optional(),
        body('IS_MSME_REGISTERED').optional().toInt().isInt(),
        body('IS_ANOTHER_BRANCH').optional().toInt().isInt(),
        body('IS_SHOP_ACT_LICENSE').optional().toInt().isInt(),
        body('IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR').optional().toInt().isInt(),
        body('IS_GST_REGISTARTION_CERTIFICATE').optional().toInt().isInt(),
        body('IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY').optional().toInt().isInt(),
        body('IS_OTHER_LICENSE').optional().toInt().isInt(),
        body('IS_SISTER_OR_ASSOCIATE_CONSERN').optional().toInt().isInt(),
        body('IS_ANY_CHANGE_IN_CONSTITUENTS').optional().toInt().isInt(),
        body('IS_PARTNERS').optional().toInt().isInt(),
        body('IS_RENT_AGREEMENT_DONE').optional().toInt().isInt(),
        body('IS_INVOLVE_IN_MANUFACTURING_PROCESS').optional().toInt().isInt(),

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
        mm.executeQuery('select count(*) as cnt from ' + viewFirmInformation + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get firmInformation count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewFirmInformation + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get firmInformation information."
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
            mm.executeQueryData('INSERT INTO ' + firmInformation + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save firmInformation information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "FirmInformation information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + firmInformation + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update firmInformation information."
                    });
                }
                else {
                    console.log(results);
                    mm.executeQuery(`update applicant_extra_information set IS_PROVIDED = 1 WHERE PROPOSAL_ID = ${data.PROPOSAL_ID} AND EXTRA_INFORMATION_ID = 7 AND TYPE= 'B'`, supportKey, (error, resultsUpdate) => {
                        if (error) {
                            //logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                            console.log(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to update Firm Information."
                            });
                        }
                        else {

                            res.send({
                                "code": 200,
                                "message": "Firm Information updated successfully...",
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
}


exports.getFirmInformation = (req, res) => {

    try {

        var PROPOSAL_ID = req.body.PROPOSAL_ID;
        var supportKey = req.headers['supportkey'];


        if (PROPOSAL_ID) {
            var query = `SET SESSION group_concat_max_len = 4294967290;SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT(
                'ID',ID,
                'PROPOSAL_ID',PROPOSAL_ID,
                'NAME_OF_FIRM',NAME_OF_FIRM,
                'NATURE_OF_BUSINESS',NATURE_OF_BUSINESS,
                'CONSTITUTION_OF_FIRM',CONSTITUTION_OF_FIRM,
                'IS_MSME_REGISTERED',IS_MSME_REGISTERED,
                'LANDMARK',MSME_REGISTRATION_NUMBER,
                'MSME_REGISTRATION_NUMBER',MSME_REGISTRATION_NUMBER,
                'MSME_REGISTRATION_DATE',MSME_REGISTRATION_DATE,
                'IS_INVOLVE_IN_MANUFACTURING_PROCESS',IS_INVOLVE_IN_MANUFACTURING_PROCESS,
                'DATE_OF_REGISTRATION',DATE_OF_REGISTRATION,
                'REGISTRATION_NUMBER',REGISTRATION_NUMBER,
                'PAN_NUMBER_OF_FIRM',PAN_NUMBER_OF_FIRM,
                'REGISTERED_OFFICE_ADDRESS_ID',REGISTERED_OFFICE_ADDRESS_ID,
                'IS_ANOTHER_BRANCH',IS_ANOTHER_BRANCH,
                'ANOTHER_BRANCH_ADDRESS_ID',ANOTHER_BRANCH_ADDRESS_ID,
                'OWNERSHIP_OF_BUSINESS',OWNERSHIP_OF_BUSINESS,
                'IS_SHOP_ACT_LICENSE',IS_SHOP_ACT_LICENSE,
                'IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR',IS_SHOP_ACT_LICENSE_RENEWAL_FOR_CURRENT_YEAR,
                'IS_GST_REGISTARTION_CERTIFICATE',IS_GST_REGISTARTION_CERTIFICATE,
                'IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY',IS_CERTIFICATE_FROM_PROFESSIONAL_TAX_AUTHORITY,
                'IS_OTHER_LICENSE',IS_OTHER_LICENSE,
                'OTHER_LICENSE_NAME',OTHER_LICENSE_NAME,
                'LANDLINE_NUMBER',LANDLINE_NUMBER,
                'EMAIL_ID',EMAIL_ID,
                'IS_SISTER_OR_ASSOCIATE_CONSERN',IS_SISTER_OR_ASSOCIATE_CONSERN,
                
                'IS_ANY_CHANGE_IN_CONSTITUENTS',IS_ANY_CHANGE_IN_CONSTITUENTS,
                'CHANGE_IN_CONSTITUENTS_DETAILS',CHANGE_IN_CONSTITUENTS_DETAILS,
                'PRIME_COSTOMERS_DETAILS',PRIME_COSTOMERS_DETAILS,
                'DETAILS_OF_WORK_ORDERS',DETAILS_OF_WORK_ORDERS,
                'GST_NUMBER',GST_NUMBER,
                'SHOP_ACT_NUMBER',SHOP_ACT_NUMBER,
                'OTHER_LICENSE_NUMBER',OTHER_LICENSE_NUMBER,
                'IS_PARTNERS',IS_PARTNERS,
                'CLIENT_ID',CLIENT_ID,
                'OWNER_NAME',OWNER_NAME,
                'IS_RENT_AGREEMENT_DONE',IS_RENT_AGREEMENT_DONE,
                'RENT_AGREEMENT_END_DATE',RENT_AGREEMENT_END_DATE,
                'NEW_DIRECTORS_PARTNERS_TRUSTEE_INFO',NEW_DIRECTORS_PARTNERS_TRUSTEE_INFO,
                'OLD_DIRECTORS_PARTNERS_TRUSTEE_INFO',OLD_DIRECTORS_PARTNERS_TRUSTEE_INFO,
                
                'REGISTERED_OFFICE_ADDRESS',IFNULL((
              SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_address_information where ID = m.REGISTERED_OFFICE_ADDRESS_ID),'[]'),
                
                'ANOTHER_BRANCH_ADDRESS',IFNULL((
              SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_address_information where ID = m.ANOTHER_BRANCH_ADDRESS_ID),'[]'),
                
                'PARTNERS_INFORMATION',IFNULL((
              SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'NAME',NAME,'PAN_NUMBER',PAN_NUMBER,'AADHAR',AADHAR,'DIRECTORS_IDENTITY_NUMBER',DIRECTORS_IDENTITY_NUMBER,'MOBILE_NUMBER',MOBILE_NUMBER,'GENDER',GENDER,'DOB',DOB,'CASTE',CASTE,'RELIGION',RELIGION,'EDUCATION',EDUCATION,'MEMBERSHIP_NUMBER',MEMBERSHIP_NUMBER,'RELATIONSHIP_WITH_OTHER',RELATIONSHIP_WITH_OTHER,'IS_AUTHORISED_TO_TRANSACT',IS_AUTHORISED_TO_TRANSACT,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_partners_information where FIRM_INFORMATION_ID = m.ID),'[]'),
                                            
                        'MANUFACTURING_INFORMATION',IFNULL((
              SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'NAME_OF_PRODUCT',NAME_OF_PRODUCT,'USE_OF_PRODUCT_IN_DETAILS',USE_OF_PRODUCT_IN_DETAILS,'IS_ANCILILLARY_PRODUCT',IS_ANCILILLARY_PRODUCT,'FINAL_USE_OF_PRODUCT',FINAL_USE_OF_PRODUCT,'AVAILABILITY_OF_MARKET',AVAILABILITY_OF_MARKET,'PLACE_OF_MARKET',PLACE_OF_MARKET,'CLIENT_ID',CLIENT_ID,'RAW_PRODUCT_DETAILS',RAW_PRODUCT_DETAILS,'CREDIT_TERMS_DETAILS',CREDIT_TERMS_DETAILS)),']'),'"[','['),']"',']') as data FROM view_manufacturing_information where FIRM_INFORMATION_ID = m.ID),'[]'),
                
                
                'SISTER_OR_ASSOCIATE_CONSERN_INFORMATION',IFNULL((
              SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'NAME_OF_FIRM',NAME_OF_FIRM,'NATURE_OF_BUSINESS',NATURE_OF_BUSINESS,'CONSTITUTION',CONSTITUTION,'BANKERS',BANKERS,'TOTAL_LOAN_OR_ADVANCE',TOTAL_LOAN_OR_ADVANCE,'SECURITY_OFFERED_FOR_LOAN',SECURITY_OFFERED_FOR_LOAN,'OUTSTANDING_AMOUNT',OUTSTANDING_AMOUNT,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_sister_or_associate_concern where FIRM_INFORMATION_ID = m.ID),'[]'),
                
                    'FACTORY_UNIT_INFORMATION',IFNULL((
              SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'EXISTING_LAND_AREA',EXISTING_LAND_AREA,'EXISTING_CONSTRUCTION_AREA',EXISTING_CONSTRUCTION_AREA,'PROPOSED_LAND_AREA',PROPOSED_LAND_AREA,'PROPOSED_CONSTRUCTION_AREA',PROPOSED_CONSTRUCTION_AREA,'TYPE_OF_FACTORY',TYPE_OF_FACTORY,'IS_SUFFICIENT_AREA',IS_SUFFICIENT_AREA,'IS_AVAILABILITY_OF_ELECTRICITY',IS_AVAILABILITY_OF_ELECTRICITY,'IS_AVAILABILITY_OF_WATER',IS_AVAILABILITY_OF_WATER,'IS_AVAILABILITY_OF_TRANSPORT',IS_AVAILABILITY_OF_TRANSPORT,'IS_AVAILABILITY_OF_WORKERS',IS_AVAILABILITY_OF_WORKERS,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_factory_unit_information where FIRM_INFORMATION_ID = m.ID),'[]'),							
                
                'DETAILS_OF_EMPLOYEE',IFNULL((
              SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'EMPLOYEE_CATEGORY',EMPLOYEE_CATEGORY,'COUNT',COUNT,'EDUCATINALLY_QUALIFIED',EDUCATINALLY_QUALIFIED,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_details_of_employee where FIRM_INFORMATION_ID = m.ID),'[]'),

  'FIRM_BRANCHES_DETAILS',IFNULL((
                SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',a.ID,'FIRM_INFORMATION_ID',a.FIRM_INFORMATION_ID,'BRANCH_NAME',a.BRANCH_NAME,'ADDRESS_ID',a.ADDRESS_ID,'ADDRESS',IFNULL((
                SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'STATE',STATE,'DISTRICT',DISTRICT,'TALUKA',TALUKA,'VILLAGE',VILLAGE,'PINCODE',PINCODE,'LANDMARK',LANDMARK,'BUILDING',BUILDING,'HOUSE_NO',HOUSE_NO,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_address_information where ID = a.ADDRESS_ID),'[]'),
                              'ARCHIVE_FLAG',a.ARCHIVE_FLAG,'CLIENT_ID',a.CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_firm_branches_details a where FIRM_INFORMATION_ID = m.ID),'[]'),
            'FIRM_DIRECTORS_DETAILS',IFNULL((
                SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'FIRM_INFORMATION_ID',FIRM_INFORMATION_ID,'TYPE',TYPE,'NAME',NAME,'DATE',DATE,'ARCHIVE_FLAG',ARCHIVE_FLAG,'CLIENT_ID',CLIENT_ID)),']'),'"[','['),']"',']') as data FROM view_firm_directors_details where FIRM_INFORMATION_ID = m.ID),'[]')
                 

                )),']'),'"[','['),']"',']') as data FROM view_firm_information m where PROPOSAL_ID = ${PROPOSAL_ID}`;


            mm.executeQuery(query, supportKey, (error, results) => {
                if (error) {
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get all property information."
                    });
                }
                else {

                    var json = results[1][0].data;
                    if (json)
                        json = json.replace(/\\/g, '');
                    console.log(json);
                    res.send({
                        code: 200,
                        message: "success",
                        data: JSON.parse(json)
                    });
                }
            });
        }
        else {

            res.send({
                "code": 400,
                "message": "Parameter Missing - ProposalId"
            });

        }
    } catch (error) {
        console.log(error)
    }


}





