
const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');

function reqData(req) {
    var data = {
        ID: req.body.ID,
        G_ID: req.body.G_ID,
        G_NAME: req.body.G_NAME,
        G_DOB: req.body.G_DOB,
        G_AGE: req.body.G_AGE,
        G_FATHER_NAME: req.body.G_FATHER_NAME,
        G_RELATION: req.body.G_RELATION,
        G_MOBILE: req.body.G_MOBILE,
        G_OCCUPATION: req.body.G_OCCUPATION,
        G_NET_WORTH: req.body.G_NET_WORTH,
        G_GROSS_MONTHLY_INCOME: req.body.G_GROSS_MONTHLY_INCOME,
        G_LIABILITIES: req.body.G_LIABILITIES,
        GC_STATE: req.body.GC_STATE,
        GC_DISTRICT: req.body.GC_DISTRICT,
        GC_TALUKA: req.body.GC_TALUKA,
        GC_VILLAGE: req.body.GC_VILLAGE,
        GC_PINCODE: req.body.GC_PINCODE,
        GC_LANDMARK: req.body.GC_LANDMARK,
        GC_BUILDING: req.body.GC_BUILDING,
        GC_HOUSE_NO: req.body.GC_HOUSE_NO,
        GP_STATE : req.body.GP_STATE,
        GP_DISTRICT : req.body.GP_DISTRICT,
        GP_TALUKA : req.body.GP_TALUKA,
        GP_VILLAGE : req.body.GP_VILLAGE,
        GP_PINCODE : req.body.GP_PINCODE,
        GP_LANDMARK : req.body.GP_LANDMARK,
        GP_BUILDING : req.body.GP_BUILDING,
        GP_HOUSE_NO : req.body.GP_HOUSE_NO,
        ARCHIVE_FLAG: req.body.ARCHIVE_FLAG
    }

    return data;
}

exports.validate = function () {
    return [

        body('ID').optional(),
        body('G_ID').isInt(),
        body('G_NAME').optional(),
        body('G_DOB').optional(),
        body('G_AGE').optional(),
        body('G_FATHER_NAME').optional(),
        body('G_RELATION').optional(),
        body('G_MOBILE').optional(),
        body('G_OCCUPATION').optional(),
        body('G_NET_WORTH').isInt().optional(),
        body('G_GROSS_MONTHLY_INCOME').isInt().optional(),
        body('G_LIABILITIES').isInt().optional(),
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
    const q = `insert into jyoti_micro_guarantor_personal set ?`;
    const supportKey = req.headers['supportKey'];
    console.log(`--------------------- ${setData}-------------------------`);
    console.log(`--------------------- ${recData}-------------------------`);

    db.executeDML(q, data, supportKey, connection, (error, results) => {
        if (error) {
            db.rollbackConnection(connection);
            res.send({
                "code": 400,
                "message": "failed to create information for JyotiMicro Guarantor Personal ."
            })
        }
        else {
            db.commitConnection(connection)
            res.send({
                "code": 200,
                "message": "Information created successfully for JyotiMicro Guarantor Personal",
            })
        }
    })
}

exports.get = (req, res) => {

    const sortKey = req.body.G_ID;
    const supportKey = req.headers.supportKey;
    const q = `select * from jyoti_micro_guarantor_personal where G_ID = ${sortKey} AND ARCHIVE_FLAG = 'F'`

    mm.executeQuery(q, supportKey, (error, results) => {
        if (error) {
            res.send({
                "code": 400,
                "message": "failed to get data from JyotiMicro Guarantor Personal"
            })
        }
        else {
            res.send({
                "code": 200,
                "message": "ok",
                "data": results
            })
        }

    })

}
exports.update = (req, res) => {
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
    const setData2 = setData.slice(0, -1)
    console.log(`set data = ${setData2}`);
    const q = `update jyoti_micro_guarantor_personal set ${setData2} where ID = ${ID}`
    console.log(q);
    mm.executeQueryData(q, recData, supportkey, (error, results) => {
        if (error) {
            console.log(recData);
            db.rollbackConnection(connection)
            console.log(error);
            res.send({
                "code": 400,
                "message": "failed to update information for JyotiMicro Guarantor Personal"
            })
        }
        else {
            db.commitConnection(connection);
            res.send({
                "code": 200,
                "message": "Inforamation update successful for JyotiMicro Guarantor Personal"
            })
        }
    })
}