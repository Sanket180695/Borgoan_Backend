const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');

function reqData(req) {
    var data = {
    
    G_ID: req.body.G_ID,
    PROPERTY_TYPE: req.body.PROPERTY_TYPE,
    PROPERTY_DETAILS : req.body.PROPERTY_DETAILS,
    TOTAL_AREA : req.body.TOTAL_AREA,
    OUT_OF_WHICH : req.body.OUT_OF_WHICH,
    AKAR_RS : req.body.AKAR_RS,
    ESTIMATED_PRICE : req.body.ESTIMATED_PRICE,
    REMARK : req.body.REMARK,
    CATEGORY_OF_SOIL : req.body.CATEGORY_OF_SOIL,
    R_S_NO : req.body.R_S_NO,
    HISSA : req.body.HISSA,
    TMC_NO : req.body.TMC_NO,
    SURVEY_NO : req.body.SURVEY_NO,
    VPC_NO : req.body.VPC_NO,
    FLAT_NO : req.body.FLAT_NO,
    PLOT_NO : req.body.PLOT_NO,
    E_SWATTU : req.body.E_SWATTU,
    CTS_NO : req.body.CTS_NO,
    AREA : req.body.AREA,
    EAST : req.body.EAST,
    WEST : req.body.WEST,
    NORTH : req.body.NORTH,
    SOUTH : req.body.SOUTH,
    DOC_CONFIRM : req.body.DOC_CONFIRM,
    OLD_OR_NEW : req.body.OLD_OR_NEW,
    VEHICLE_NAME : req.body.VEHICLE_NAME,
    VEHICLE_TYPE : req.body.VEHICLE_TYPE,
    VEHICLE_NO :  req.body.VEHICLE_NO,
    MODEL_NO : req.body.MODEL_NO,
    ENGINE_NO : req.body.ENGINE_NO,
    CHESIS_NO : req.body.CHESIS_NO,
    VALUATION : req.body.VALUATION,
    INSURANCE_COPM : req.body.INSURANCE_COPM,
    POLICY_NO : req.body.POLICY_NO,
    VALUATION_DATE : req.body.VALUATION_DATE,
    INSURANCE_EXPIRY_DATE : req.body.INSURANCE_EXPIRY_DATE,
    GP_STATE : req.body.GP_STATE,
    GP_DISTRICT : req.body.GP_DISTRICT,
    GP_TALUKA : req.body.GP_TALUKA,
    GP_VILLAGE : req.body.GP_VILLAGE,
    GP_PINCODE : req.body.GP_PINCODE,
    GP_LANDMARK : req.body.GP_LANDMARK,
    GP_BUILDING : req.body.GP_BUILDING,
    GP_HOUSE_NO : req.body.GP_HOUSE_NO,
    ARCHIVE_FLAG: req.body.ARCHIVE_FLAG,
    APPROXIMATE_VALUES:req.body.APPROXIMATE_VALUES,
    REMARKS : req.body.REMARKS
    }

    return data;
}
exports.validate = function () {
    return [

        body('ID').optional(),
        body('G_ID').isInt().optional(),
        body('PROPERTY_TYPE').optional(),
        body('PROPERTY_DETAILS').optional(),
        body('TOTAL_AREA').isInt().optional(),
        body('OUT_OF_WHICH').isInt().optional(),
        body('AKAR_RS').isInt().optional(),
        body('ESTIMATED_PRICE').isInt().optional(),
        body('REMARK').optional(),
        body('CATEGORY_OF_SOIL').optional(),
        body('R_S_NO').optional(),
        body('HISSA').optional(),
        body('TMC_NO').optional(),
        body('SURVEY_NO').optional(),
        body('VPC_NO').optional(),
        body('FLAT_NO').optional(),
        body('PLOT_NO').optional(),
        body('E_SWATTU').optional(),
        body('CTS_NO').optional(),
        body('AREA').optional(),
        body('EAST').optional(),
        body('WEST').optional(),
        body('NORTH').optional(),
        body('SOUTH').optional(),
        body('DOC_CONFIRM').optional(),
        body('OLD_OR_NEW').optional(),
        body('VEHICLE_NAME').optional(),
        body('VEHICLE_TYPE').optional(),
        body('VEHICLE_NO').optional(),
        body('MODEL_NO').optional(),
        body('ENGINE_NO').optional(),
        body('CHESIS_NO').optional(),
        body('VALUATION').isInt().optional(),
        body('INSURANCE_COPM').optional(),
        body('POLICY_NO').isInt().optional(),
        body('VALUATION_DATE').optional(),
        body('INSURANCE_EXPIRY_DATE').optional(),
        body('GP_STATE').optional(),
        body('GP_TALUKA').optional(),
        body('GP_VILLAGE').optional(),
        body('GP_PINCODE').optional(),
        body('GP_LANDMARK').optional(),
        body('GP_BUILDING').optional(),
        body('GP_HOUSE_NO').optional(),
        body('GP_DISTRICT').optional(),
        body('ARCHIVE_FLAG').optional()


    ]
}

exports.create = (req, res) => {

    const data = reqData(req);
    var connection = db.openConnection()
    let setData = '';
    let recData = [];

    Object.keys(data).forEach(key => {
        data[key] ? setData += `${key},` : true;
        data[key] ? recData.push(data[key]) : true;
    });

    const setData2 = setData.slice(0, -1)
    const q = `insert into jyoti_micro_guarantor_property set ?`;
    const supportKey = req.headers['supportKey'];
    console.log(`--------------------- ${setData}-------------------------`);
    console.log(`--------------------- ${recData}-------------------------`);

    db.executeDML(q, data, supportKey, connection, (error, results) => {
        if (error) {
            db.rollbackConnection(connection);
            res.send({
                "code": 400,
                "message": "failed to create information for Jyoti Micro Guarantor Property ."
            })
        }
        else {
            db.commitConnection(connection)
            res.send({
                "code": 200,
                "message": "Information created successfully for Jyoti Micro Guarantor Property",
            })
        }
    })
}


exports.get = (req,res) =>{
    const sortKey = req.body.G_ID;
    const supportKey = req.headers['supportKey'];
    const q = `select * from jyoti_micro_guarantor_property where G_ID = ${sortKey} AND ARCHIVE_FLAG = 'F'`

    mm.executeQuery(q, supportKey, (error, results)=>{
        if(error)
        {
            console.log(error);
            res.send({
                "code":400,
                "message":"failed to get data from Jyoti Micro Guarantor Property"
            })
        }
        else
        {
            res.send({"code": 200,
            "message": "ok",
            "data": results})
        }
        
    } )
}

exports.update = (req,res)=>{
    const ID = req.body.ID;
    const data = reqData(req)
    console.log(data);
    var connection = db.openConnection()
    const supportkey = req.headers['supportkey']
    let setData = '';
    let recData = [];
    Object.keys(data).forEach(key => {
        data[key] ? setData += `${key}= ? ,` : true;
        data[key] ? recData.push(data[key]) : true;
    });
    const setData2 = setData.slice(0,-1)
    console.log(`set data = ${setData2}`);
    const q = `update jyoti_micro_guarantor_property set ${setData2} where ID = ${ID} AND ARCHIVE_FLAG = 'F'`
    console.log(q);
    mm.executeQueryData(q, recData, supportkey, (error, results)=>{
        if(error){
            console.log(recData);
            db.rollbackConnection(connection)
            console.log(error);
            res.send({
                "code":400,
                "message": "failed to update information for Jyoti Micro Guarantor Property"
            })
        }
        else{
            db.commitConnection(connection);
            res.send({
                "code":200,
                "message": "Inforamation update successful for Jyoti Micro Guarantor Property"
            })
        }
    } )
}