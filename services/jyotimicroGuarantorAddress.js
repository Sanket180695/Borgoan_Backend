
const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');

function reqData(req) {
    var data = {
        ID : req.body.ID,
        G_ID : req.body.G_ID,
        TYPE_ID : req.body.TYPE_ID,
        ADDR_TYPE : req.body.ADDR_TYPE,
        STATE : req.body.STATE,
        DISTRICT : req.body.DISTRICT,
        TALUKA : req.body.TALUKA,
        VILLAGE : req.body.VILLAGE,
        PINCODE: req.body.PINCODE,
        LANDMARK : req.body.LANDMARK,
        BUILDING : req.body.BUILDING,
        HOUSE_NO : req.body.HOUSE_NO,
        ARCHIVE_FLAG : req.body.ARCHIVE_FLAG
    }

    return data;
}

exports.validate = function () {
    return [

        body('ID').isInt().optional(),
        body('G_ID').isInt().optional(),
        body('TYPE_ID').isInt().optional(),
        body('ADDRESS_TYPE').optional(),
        body('STATE').optional(),
        body('DISTICT').optional(),
        body('TALUKA').optional(),
        body('PINCODE').optional(),
        body('LANDMARK').optional(),
        body('BUILDING').optional(),
        body('HOUSE_NO').optional(),
        body('ARCHIVE_FLAG').optional()
        
    ]
}

exports.create = (req,res) => {

    const data = reqData(req);
    var connection = db.openConnection()
    let setData = '';
    let recData = [];

    

   
    const q = `insert into jyoti_micro_guarantor_address set ?`
    const supportKey = req.headers['supportKey'];
    console.log(`--------------------- ${setData}-------------------------`);
    console.log(`--------------------- ${recData}-------------------------`);

    db.executeDML(q,data,supportKey,connection,(error, results) => {
        if (error) {
            db.rollbackConnection(connection)
            console.log("error",error);
            res.send({
                "code": 400,
                "message": "failed to create information for Jyoti Micro Guarantor Address ."
            })
        }
        else {
            db.commitConnection(connection)
            res.send({
                "code": 200,
                "message": "Information created successfully for Jyoti Micro Guarantor Address",
            })
        }
    })
}

exports.get = (req, res) =>{
 
    const G_ID = req.body.G_ID;
    const TYPE_ID = req.body.TYPE_ID;
    const ADDR_TYPE =req.body.ADDR_TYPE;
    const supportKey = req.headers.supportKey;
    const q = `select * from jyoti_micro_guarantor_address where G_ID = ${G_ID} AND TYPE_ID = ${TYPE_ID} AND ADDR_TYPE = '${ADDR_TYPE}' AND ARCHIVE_FLAG = 'F'`

    mm.executeQuery(q, supportKey, (error, results)=>{
        if(error)
        {
            console.log((error));
            res.send({
                "code":400,
                "message":"Failed to get data from Jyoti Micro Guarantor Address"
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
    const q = `update jyoti_micro_guarantor_address set ${setData2} where ID = ${ID}`
    console.log(q);
    mm.executeQueryData(q, recData, supportkey, (error, results)=>{
        if(error){
            console.log(recData);
            db.rollbackConnection(connection)
            console.log(error);
            res.send({
                "code":400,
                "message": "failed to update information for Jyoti Micro Guarantor Address"
            })
        }
        else{
            db.commitConnection(connection);
            res.send({
                "code":200,
                "message": "Inforamation update successful for Jyoti Micro Guarantor Address"
            })
        }
    } )
}