const mm = require('../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var documentGroupMaster = "document_group_master";
var viewDocumentGroupMaster = "view_" + documentGroupMaster;


function reqData(req) {

    var data = {
        NAME: req.body.NAME,
        NAME_EN: req.body.NAME_EN,
        NAME_KN: req.body.NAME_KN,
        STATUS: req.body.STATUS ? '1' : '0',

        CLIENT_ID: req.body.CLIENT_ID,
        PARENT_ID: req.body.PARENT_ID,
        IS_PARENT: req.body.IS_PARENT ? '1' : '0',
    }
    return data;
}



exports.validate = function () {
    return [

        body('NAME', ' parameter missing').exists(), 
        body('NAME_EN', ' parameter missing').exists(), 
        body('NAME_KN', ' parameter missing').exists(), 
        body('ID').optional(),


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
        mm.executeQuery('select count(*) as cnt from ' + viewDocumentGroupMaster + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                res.send({
                    "code": 400,
                    "message": "Failed to get documentGroups count.",
                });
            }
            else {
                console.log(results1);
                mm.executeQuery('select * from ' + viewDocumentGroupMaster + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                        res.send({
                            "code": 400,
                            "message": "Failed to get documentGroup information."
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
            mm.executeQueryData('INSERT INTO ' + documentGroupMaster + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    res.send({
                        "code": 400,
                        "message": "Failed to save documentGroup information..."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "DocumentGroup information saved successfully...",
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
            mm.executeQueryData(`UPDATE ` + documentGroupMaster + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update documentGroup information."
                    });
                }
                else {
                    console.log(results);
                    res.send({
                        "code": 200,
                        "message": "DocumentGroup information updated successfully...",
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







exports.getDocumentsMultiselect = (req, res) => {
    try {
        let filter = req.body.filter ? req.body.filter : ``;
		let key = req.body.KEY ? req.body.KEY : 1;
        var supportKey = req.headers['supportkey'];
		
		var language = '';
		if(key){
			
		
        var query1 = `SET SESSION group_concat_max_len = 4000000;
        SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',d.ID,'title',d.NAME,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = d.ID),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = d.ID AND STATUS = 1),
        
        'children',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',g.ID,'title',g.NAME,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = g.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = g.ID AND STATUS = 1),
        'children',ifnull((			
         SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',s.ID,'title',s.NAME,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = s.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = s.ID AND STATUS = 1),
         
         'children',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',j.ID,'title',j.NAME,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = j.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = j.ID AND STATUS = 1),
         
         'children',ifnull(((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',k.ID,'title',k.NAME,'disabled','false','expanded','false','isLeaf','true')),']'),'"[','['),']"',']') as data FROM view_document_group_master k where STATUS = 1 and PARENT_ID = j.ID )),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master j where STATUS = 1 and PARENT_ID = s.ID ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master s where STATUS = 1 and PARENT_ID = g.ID				
        ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master g where STATUS = 1 and PARENT_ID = d.ID ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master d where STATUS = 1 AND PARENT_ID = 0 `+ filter;


        var query2 = `SET SESSION group_concat_max_len = 4000000;
        SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',d.ID,'title',d.NAME_EN,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = d.ID),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = d.ID AND STATUS = 1),
        
        'children',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',g.ID,'title',g.NAME_EN,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = g.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = g.ID AND STATUS = 1),
        'children',ifnull((			
         SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',s.ID,'title',s.NAME_EN,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = s.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = s.ID AND STATUS = 1),
         
         'children',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',j.ID,'title',j.NAME_EN,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = j.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = j.ID AND STATUS = 1),
         
         'children',ifnull(((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',k.ID,'title',k.NAME_EN,'disabled','false','expanded','false','isLeaf','true')),']'),'"[','['),']"',']') as data FROM view_document_group_master k where STATUS = 1 and PARENT_ID = j.ID )),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master j where STATUS = 1 and PARENT_ID = s.ID ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master s where STATUS = 1 and PARENT_ID = g.ID				
        ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master g where STATUS = 1 and PARENT_ID = d.ID ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master d where STATUS = 1 AND PARENT_ID = 0 `+ filter;

        var query3 = `SET SESSION group_concat_max_len = 4000000;
        SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',d.ID,'title',d.NAME_KN,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = d.ID),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = d.ID AND STATUS = 1),
        
        'children',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',g.ID,'title',g.NAME_KN,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = g.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = g.ID AND STATUS = 1),
        'children',ifnull((			
         SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',s.ID,'title',s.NAME_KN,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = s.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = s.ID AND STATUS = 1),
         
         'children',ifnull((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',j.ID,'title',j.NAME_KN,'disabled',(select if(count(*) > 0 ,'true','false') from view_document_group_master where PARENT_ID = j.ID and STATUS = 1),'expanded','false','isLeaf',(select if(IS_PARENT = 0 ,'true','false') from view_document_group_master where ID = j.ID AND STATUS = 1),
         
         'children',ifnull(((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('key',k.ID,'title',k.NAME_KN,'disabled','false','expanded','false','isLeaf','true')),']'),'"[','['),']"',']') as data FROM view_document_group_master k where STATUS = 1 and PARENT_ID = j.ID )),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master j where STATUS = 1 and PARENT_ID = s.ID ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master s where STATUS = 1 and PARENT_ID = g.ID				
        ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master g where STATUS = 1 and PARENT_ID = d.ID ),'[]'))),']'),'"[','['),']"',']') as data FROM view_document_group_master d where STATUS = 1 AND PARENT_ID = 0 `+ filter;



		language = ((key == 1)?query1:((key==2)?query2:((key==3)?query3:``)))
	
        mm.executeQuery(language, supportKey, (error, resultsPurposeInfo) => {
            if (error) {
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
                console.log(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Document information."
                });
            }
            else {

                var json1 = resultsPurposeInfo[1][0].data;
                if (json1)
                    json1 = json1.replace(/\\/g, '').replace(/"true"/g, true).replace(/"false"/g, false);

                console.log(json1);

                res.send({
                    "code": 200,
                    "message": "success",
                    "data": JSON.parse(json1)
                });
            }

        });
		}
		else
		{
			res.send({
                    "code": 400,
                    "message": "Parameter missing - key"
                });
		}


    } catch (error) {
        console.log(error);
    }
}
