const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');

function reqData(req) {
    var data = {
        ID: req.body.ID,
        P_ID: req.body.P_ID,
        G_ID: req.body.G_ID,
        EMP_PHONE: req.body.EMP_PHONE,
        EMP_NAME: req.body.EMP_NAME,
        EMP_ADD: req.body.EMP_ADD,
        ARCHIVE_FLAG: req.body.ARCHIVE_FLAG
    }

    return data;
}


exports.validate = function () {
    return [

        body('ID').isInt().optional(),
        body('P_ID').isInt(),
        body('G_ID').isInt().optional(),
        body('EMP_PHONE').optional(),
        body('EMP_NAME').optional(),
        body('EMP_ADD').optional(),
        body('ARCHIVE_FLAG').optional(),


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
    const q = `insert into jyoti_micro_guarantor_personal_employer set ?`;
    const supportKey = req.headers['supportKey'];
    console.log(`--------------------- ${setData}-------------------------`);
    console.log(`--------------------- ${recData}-------------------------`);

    db.executeDML(q, data, supportKey, connection, (error, results) => {
        if (error) {
            db.rollbackConnection(connection);
            res.send({
                "code": 400,
                "message": "failed to create information for Jyoti Micro Guarantor Personal Employer ."
            })
        }
        else {
            db.commitConnection(connection)
            res.send({
                "code": 200,
                "message": "Information created successfully for Jyoti Micro Guarantor Personal Employer",
            })
        }
    })
}

exports.get = (req, res) =>{
 
    const G_ID = req.body.G_ID;
    const P_ID = req.body.P_ID;
    const supportKey = req.headers.supportKey;
    const q = `select * from jyoti_micro_guarantor_personal_employer where G_ID = ${G_ID} AND ARCHIVE_FLAG = 'F'`

    mm.executeQuery(q, supportKey, (error, results)=>{
        if(error)
        {
            res.send({
                "code":400,
                "message":"failed to get data from Jyoti Micro Guarantor Personal Employer"
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
    const q = `update jyoti_micro_guarantor_personal_employer set ${setData2} where ID = ${ID}`
    console.log(q);
    mm.executeQueryData(q, recData, supportkey, (error, results)=>{
        if(error){
            console.log(recData);
            db.rollbackConnection(connection)
            console.log(error);
            res.send({
                "code":400,
                "message": "failed to update information for Jyoti Micro Guarantor Personal Employer"
            })
        }
        else{
            db.commitConnection(connection);
            res.send({
                "code":200,
                "message": "Inforamation update successful for Jyoti Micro Guarantor Personal Employer"
            })
        }
    } )
}