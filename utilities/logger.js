const request = require('request');

exports.database = (message, applicationkey, supportkey) => {

    try {
        console.log('supportkey : ', supportkey)
        var options = {
            url: process.env.GM_API + 'device/addDbLog',
            method: 'POST',
            json: true,
            headers: {
                'apikey': process.env.GM_API_KEY,
                'applicationkey': process.env.APPLICATION_KEY,
                'supportkey': supportkey
            },
            body: {
                MESSAGE: message,
                APPLICATION_KEY: applicationkey
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                console.log("addDblog Error : ", error);
            } else {
                console.log("addDblog Response : ", body);
            }
        });
    } catch (error) {
        console.log("addDblog Exception : ", error);
    }
}


exports.info = async (message, applicationkey, deviceid, supportkey) => {

    try {
        //console.log('supportkey : ',supportkey)

        var options = {
            url: process.env.GM_API + 'device/addAPILog',
            method: 'POST',
            headers: {
                'apikey': process.env.GM_API_KEY,
                'applicationkey': process.env.APPLICATION_KEY,
                'supportkey': supportkey,
                'deviceid': deviceid
            },
            body: {
                MESSAGE: message,
                APPLICATION_KEY: applicationkey
            },
            json: true
        };

        //console.log(options.url);

        request(options, (error, response, body) => {
            if (error) {
                console.log("addInfoLog Error : ", error);
            } else {
                console.log("addInfoLog Response : ", body);
            }
        });
    } catch (error) {
        console.log("addInfoLog exception : ", error);
    }
}


exports.error = async (message, applicationkey, supportkey, deviceid) => {

    try {
        //console.log('supportkey : ',supportkey);

        var options = {
            url: process.env.GM_API + 'device/addErrorLog',
            method: 'POST',
            json: true,
            headers: {
                'User-Agent': 'request',
                'apikey': process.env.GM_API_KEY,
                'applicationkey': process.env.APPLICATION_KEY,
                'supportkey': supportkey,
                'deviceid': deviceid
            },
            body: {
                MESSAGE: message,
                APPLICATION_KEY: applicationkey
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                console.log("addErrlog Error : ", error);
            } else {
                console.log("addErrlog Response : ", body);
            }
        });

    } catch (error) {
        console.log("addErrlog Exception : ", error);
    }
}



exports.notificationlog=(message, applicationkey, supportkey, deviceid)=>{
    try {
        //console.log('supportkey : ',supportkey);

        var options = {
            url: process.env.GM_API + 'device/addErrorLog',
            method: 'POST',
            json: true,
            headers: {
                'User-Agent': 'request',
                'apikey': process.env.GM_API_KEY,
                'applicationkey': process.env.APPLICATION_KEY,
                'supportkey': supportkey,
                'deviceid': deviceid
            },
            body: {
                MESSAGE: message,
                APPLICATION_KEY: applicationkey
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                console.log("addErrlog Error : ", error);
            } else {
                console.log("addErrlog Response : ", body);
            }
        });

    } catch (error) {
        console.log("addErrlog Exception : ", error);
    }


}



