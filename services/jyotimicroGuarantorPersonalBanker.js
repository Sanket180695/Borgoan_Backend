
const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');

function reqData(req) {
    var data = {
        ID : req.body.ID,
        P_ID : req.body.P_ID,
        G_ID : req.body.G_ID,
        NAME_OF_BANKER : req.body.NAME_OF_BANKER,
        ACCOUNT_NUMBER : req.body.ACCOUNT_NUMBER,
        ARCHIVE_FLAG : req.body.ARCHIVE_FLAG
    }

    return data;
}

exports.validate = function () {
    return [

        body('ID').isInt().optional(),
        body('P_ID').isInt(),
        body('G_ID').isInt().optional(),
        body('NAME_OF_BANKER').optional(),
        body('ACCOUNT_NUMBER').optional(),
        body('ARCHIVE_FLAG').optional()
        
    ]
}

exports.create = (req,res) => {

    const data = reqData(req);
    var connection = db.openConnection()
    let setData = '';
    let recData = [];

    

    
    const q = `insert into jyoti_micro_guarantor_personal_banker set ?`;
    const supportKey = req.headers['supportKey'];
    console.log(`--------------------- ${setData}-------------------------`);
    console.log(`--------------------- ${recData}-------------------------`);

    db.executeDML(q,data,supportKey,connection,(error, results) => {
        if (error) {
            db.rollbackConnection(connection)
            console.log("error",error);
            res.send({
                "code": 400,
                "message": "failed to create information for Jyoti Micro Guarantor Personal Banker ."
            })
        }
        else {
            db.commitConnection(connection)
            res.send({
                "code": 200,
                "message": "Information created successfully for Jyoti Micro Guarantor Personal Banker",
            })
        }
    })
}

exports.get = (req, res) =>{
 
    const G_ID = req.body.G_ID;
    const P_ID = req.body.P_ID;
    const supportKey = req.headers.supportKey;
    const q = `select * from jyoti_micro_guarantor_personal_banker where G_ID = ${G_ID} AND ARCHIVE_FLAG = 'F'`

    mm.executeQuery(q, supportKey, (error, results)=>{
        if(error)
        {
            res.send({
                "code":400,
                "message":"failed to get data from Jyoti Micro Guarantor Personal Banker"
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
    
    const supportKey = req.headers['supportkey']
    console.log("supportkey")

    let setData = '';
    let recData = [];
    Object.keys(data).forEach(key => {
        data[key] ? setData += `${key} = ?,` :true ;
        data[key] ? recData.push(data[key]) :true ;
    })
    const setData2 = setData.slice(0,-1)
    console.log(`setdata =${setData2}`);
    const q = `update jyoti_micro_guarantor_personal_banker set ${setData2} where ID =${ID}`
    console.log(q);
    mm.executeQueryData(q,recData,supportKey,(error, results)=>{
        if(error){
            console.log(recData);
           
            console.log(error);
            res.send({
                "code":400,
                "message": "failed to update information for Jyoti Micro Guarantor Personal Banker"
            })
        }
        else{
            
            res.send({
                "code":200,
                "message": "Inforamation update successful for Jyoti Micro Guarantor Personal Banker"
            })
        }
    } )
}