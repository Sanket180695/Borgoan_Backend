
const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');

function reqData(req) {
    var data = {
        
        PROPOSAL_ID: req.body.PROPOSAL_ID,
        IS_OWNERSHIP_FURNISHED: req.body.IS_OWNERSHIP_FURNISHED,
        G_NAME : req.body.G_NAME,
        G_MOBILE : req.body.G_MOBILE,
        ARCHIVE_FLAG : req.body.ARCHIVE_FLAG
    }

    return data;
}

exports.validate = function () {
    return [
        body('ID').optional(),
        body('PROPOSAL_ID').isInt(),
        body('IS_OWNERSHIP_FURNISHED').optional(),
        body('G_NAME').isInt().optional(),
        body('G_MOBILE').optional(),
        body('ARCHIVE_FLAG').optional()
    ]
}

exports.create = (req,res) => {

    const data = reqData(req);
    var connection = db.openConnection()
    let setData = '';
    let recData = [];
    Object.keys(data).forEach(key => {
        data[key] ? setData += `${key},` : true;
        data[key] ? recData.push(data[key]) : true;
    });

    const setData2 = setData.slice(0, -1)

    

    
    const q = `insert into jyoti_micro_guarantor set ?`
    const supportKey = req.headers['supportKey'];
    console.log(`--------------------- ${setData}-------------------------`);
    console.log(`--------------------- ${recData}-------------------------`);

    db.executeDML(q,data,supportKey,connection,(error, results) => {
        if (error) {
            db.rollbackConnection(connection)
            console.log("errorrrrrrr",error);
            res.send({
                "code": 400,
                "message": "failed to create information for Jyotimicro Guarantor ."
            })
        }
        else {
            console.log(results);
             db.executeDML('call sp_create_jyotimicro_guarantor(?,?,?,?,?,?);' ,[data.G_NAME, data.G_MOBILE,data.PROPOSAL_ID, 'S',results.insertId, req.body.G_NAME],supportKey,connection,(error, resultsApplicantInsert) =>{
                if (error) {
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to save Jyotimicro Guarantor information..."
                    });
                }
                else {
                    db.commitConnection(connection);
                    res.send({
                        "code": 200,
                        "message": "Jyotimicro Guarantor Information saved successfully...",
                    });
                }
             });
            
        }
    })
}

exports.get = (req,res) =>{
    const sortKey = req.body.PROPOSAL_ID;
    const supportKey = req.headers['supportKey'];
    const q = `select * from jyoti_micro_guarantor where PROPOSAL_ID = ${sortKey} AND ARCHIVE_FLAG = 'F'`

    mm.executeQuery(q, supportKey, (error, results)=>{
        if(error)
        {
            console.log(error);
            res.send({
                "code":400,
                "message":"failed to get data from Jyotimicro Guarantor"
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
    const q = `update jyoti_micro_guarantor set ${setData2} where ID = ${ID}`
    console.log(q);
    mm.executeQueryData(q, recData, supportkey, (error, results)=>{
        if(error){
            console.log(recData);
            db.rollbackConnection(connection)
            console.log(error);
            res.send({
                "code":400,
                "message": "failed to update information for Jyotimicro Guarantor"
            })
        }
        else{
            db.commitConnection(connection);
            res.send({
                "code":200,
                "message": "Inforamation update successful for Jyotimicro Guarantor"
            })
        }
    } )
}