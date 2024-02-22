const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const {validationResult , body} = require ('express-validator');
const { error } = require('../utilities/logger');

function reqData(req){
    var data = {
        CLIENT_ID : req.body.CLIENT_ID,
        PROPOSAL_ID : req.body.PROPOSAL_ID,
        NAME_OF_GROUP : req.body.NAME_OF_GROUP,
        ADDRESS_OF_GROUP : req.body.ADDRESS_OF_GROUP,
        SAVING_AMOUNT : req.body.SAVING_AMOUNT,
        ANNUAL_INCOME : req.body.ANNUAL_INCOME,
        FATHER_NAME : req.body. FATHER_NAME,
        ARCHIVE_FLAG : req.body.ARCHIVE_FLAG
    }
    return data;
}

exports.validate = function () {
    return [
        body ('ID').optional(),
        body ('CLIENT_ID').optional(),
        body ('PROPOSAL_ID').optional(),
        body ('NAME_OF_GROUP').optional(),
        body ('ADDRESS_OF_GROUP').optional(),
        body ('SAVING_AMOUNT').optional(),
        body ('ANNUAL_INCOME').optional(),
        body ('FATHER_NAME').optional(),
    
    ]
    
}

exports.get = (req,res) => {
    const sortKey = req.body.PROPOSAL_ID;
    const supportKey = req.headers['supportKey'];
    const q = `select * from jyoti_micro where PROPOSAL_ID = ${sortKey} AND ARCHIVE_FLAG = 'F'`

    mm.executeQuery (q,supportKey,(error,results) =>{
        if (error) {
            res.send ({
                "code": 400,
                "message" : "failed to get data  from JyotiMicro"
            })
        }
        else{
            res.send ({
                "code" : 200,
                "message" : "ok",
                "data" : results
            })
        }
    })
}

exports.create = (req,res) => {
    const data = reqData(req);
    var connection = db.openConnection()
    let setData = '';
    let recData = [];

    
   
    const q = `insert into jyoti_micro set ?`
    const supportKey = req.headers['supportKey'];
    db.executeDML(q,data,supportKey,connection, (error,results)=>{
        if(error){
            db.rollbackConnection(connection)
            console.log("error",error);
            res.send({
                "code" : 400,
                "message" : "Failed to Create information of Jyoti Micro"
            })
        }
        else {
            db.commitConnection(connection)
            res.send({
                "code" : 200,
                "message" : "Information Created Successfully of Jyoti Micro"
            })
        }
    })
}

exports.update = (req,res) => {
    const ID = req.body.ID;
    const data = reqData(req)
    console.log (data);
    
    const supportKey = req.headers['supportkey']
    console.log("supportkey")
    let setData = '';
    let recData = [];
    Object.keys(data).forEach(key => {
        data[key] ? setData += `${key} = ?,` :true ;
        data[key] ? recData.push(data[key]) :true ;
    })
    const setData2 = setData.slice(0,-1)
    console.log (`setData =${setData2}`)
    const q = `update jyoti_micro set ${setData2} where ID =${ID}`
    console.log(q)
    

    mm.executeQueryData(q,recData,supportKey,(error,results) =>{
        if (error){
            console.log(error)
            res.send({
                "code" : 400,
                "message" : "Failed to update information of jyoti Micro"
            })
        }
        else{
            res.send({
                "code" : 200,
                "message" : "Information Updated Successfully of Jyoti Micro"
            })
        }
    })
}