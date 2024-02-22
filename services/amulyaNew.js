
const mm = require('../utilities/globalModule');
const db = require('../utilities/dbModule');
const { validationResult, body } = require('express-validator');

function reqData(req) {
    var data = {
        RESOLUTION_NO: req.body.RESOLUTION_NO,
        COMMITTEE_NO: req.body.COMMITTEE_NO,
        BOARD_MEETING_DATE: req.body.BOARD_MEETING_DATE,
        SIGNATURE: req.body.SIGNATURE,
        OUTWARD_NUMBER: req.body.OUTWARD_NUMBER,
        OUTWARD_DATE: req.body.OUTWARD_DATE,
        USER_ID: req.body.USER_ID,
        IS_COMPLETED: req.body.IS_COMPLETED,
        SELECTED_DATE: req.body.SELECTED_DATE,
        SANCTIONED_LIST: JSON.stringify(req.body.SANCTIONED_LIST),
        BATCH_ID: req.body.BATCH_ID
    }

    return data;
}

exports.validate = function () {
    return [
        body('RESOLUTION_NO').isInt(),
        body('COMMITTEE_NO').isInt().optional(),
        body('BOARD_MEETING_DATE').optional(),
        body('SIGNATURE').optional(),
        body('OUTWARD_NUMBER').isInt().optional(),
        body('OUTWARD_DATE').optional()
    ]
}

exports.create = (req, res) => {

    const data = reqData(req);
    console.log('This is request body of amulyaNew --------------- ', req.body)

    let setData = '';
    let recData = [];

    Object.keys(data).forEach(key => {
        setData += `${key}=?,`
        recData.push(data[key])
    });

    const setData2 = setData.slice(0, -1)
    console.log(`set data = ${setData2}`);
    const q = `insert into amulyaNew set ${setData2}`;

    const supportKey = req.headers['supportKey'];
    mm.executeQueryData(q, recData, supportKey, (error, results) => {
        if (error) {
            console.log(error)
            res.send({
                "code": 400,
                "message": "failed to create information for amulya ."
            })
        }
        else {
            res.send({
                "code": 200,
                "message": "Information created successfully for amulya",
            })
        }
    })
}

exports.get = (req, res) => {

    const sortKey = req.body.PROPOSAL_ID;
    const supportKey = req.headers['supportKey'];
    let q = `select * from amulyaNew where 1 AND IS_COMPLETED = 0`

    mm.executeQuery(q, supportKey, (error, results) => {
        if (error) {
            res.send({
                "code": 400,
                "message": "failed to get data from amulya"
            })
        }
        else {
            if (results.length > 0) {
                results[0].SANCTIONED_LIST = JSON.parse(results[0].SANCTIONED_LIST)
            }
            res.send({
                "code": 200,
                "message": "ok",
                "data": results
            })
        }

    })

}

exports.getCompleted = (req, res) => {
    const filter = req.body.filter;
    const supportKey = req.headers['supportKey'];
    let q = `select * from amulyaNew where 1 ${filter}`

    mm.executeQuery(q, supportKey, (error, results) => {
        if (error) {
            res.send({
                "code": 400,
                "message": "failed to get data from amulya"
            })
        }
        else {
            if (results.length > 0) {
                results[0].SANCTIONED_LIST = JSON.parse(results[0].SANCTIONED_LIST)
            }
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
    const q = `update amulyaNew set ${setData2} where ID = ${ID}`
    console.log(q);
    mm.executeQueryData(q, recData, supportkey, (error, results) => {
        if (error) {
            console.log(recData);
            db.rollbackConnection(connection)
            console.log(error);
            res.send({
                "code": 400,
                "message": "failed to update information for amulya"
            })
        }
        else {
            db.commitConnection(connection);
            res.send({
                "code": 200,
                "message": "Inforamation update successful for amulya"
            })
        }
    })
}