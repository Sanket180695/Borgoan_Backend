
// //Notification 
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://loanprosys.firebaseio.com"
});

console.log("called")
//var admin = require('../server').admin;
exports.generateNotification = function (topic, deviceID, notificationType, title, body, data1, data2, data3, imageUri, channelId) {
    //console.log(deviceID.length);

    try {
        var data = {
            notificationType: notificationType,
            title: title,
            body: body,
            data1: data1,
            data2: data2,
            data3: data3,
            imageUri: imageUri,
            channelId: channelId
        }
        
      

        var message = {
            "data": data
        };

        
        var options = {
            "priority": "high",
            //timeToLive: 1000 //default value 2419200 //four weeks
        };

        var data21 = deviceID ? deviceID : true + topic ? topic : true + " " + JSON.stringify(message) + " ";

        if (topic) {

            admin.messaging().sendToTopic(topic, message, options)
                .then((response) => {
                    // Response is a message ID string.
                    //logger.info("SUCCESS : "+data21+" response:- "+JSON.stringify(response),'notificationLog');
                    console.log('Successfully sent message to Topic:', response);
                })
                .catch((error) => {
                    // logger.info("ERROR : "+data21+" error:- "+JSON.stringify(error),'notificationLog');
                    console.log('Error sending message:', error);
                });
        }
        else if (Array.isArray(deviceID)) {
            console.log(deviceID)
            console.log('multicast');
            deviceID.forEach(deviceID => {
                admin.messaging().sendToDevice(deviceID, message, options)
                    .then((response) => {
                        // Response is a message ID string.
                        // logger.info("SUCCESS : "+data21+" response:- "+JSON.stringify(response),'notificationLog');
                        console.log('Successfully sent message to Device:', response);
                    })
                    .catch((error) => {
                        //logger.info("ERROR : "+data21+" error:- "+JSON.stringify(error),'notificationLog');
                        console.log('Error sending message:', error);
                    });
            });

        }
        else if (deviceID) {
            console.log('device');

            admin.messaging().sendToDevice(deviceID, message, options)
                .then((response) => {
                    // Response is a message ID string.
                    //logger.info(response,'0');

                    //logger.info("SUCCESS : "+data21+" response:- "+JSON.stringify(response),'notificationLog');
                    console.log('Successfully sent message to Device:', response);
                })
                .catch((error) => {
                    //logger.info(error,'0');
                    //logger.info("ERROR : "+data21+" error:- "+JSON.stringify(error),'notificationLog');
                    console.log('Error sending message:', error);
                });
        }

    } catch (error) {
        console.log(error);
    }

}

exports.generateNotification1 = (topic, deviceID, notificationType, title, body, data1, data2, data3, imageUri, channelId) => {
    try {

        if (deviceID) {
            var request = require('request');

            let options = {
                url: 'http://148.72.212.52/sendnotificationnew.aspx',
                form: {
                    topic:topic,
                    deviceId:deviceID,
                    notificationType: notificationType,
                    title: title,
                    body: body,
                    data1: data1,
                    data2: data2,
                    data3: data3,
                    imageUri: imageUri,
                    channelId: channelId
                },
                headers: { 
                    //'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                    'Content-Type' : 'application/x-www-form-urlencoded' 
                 },
                 method: 'POST'
            };

            request.post(options, (error, results) => {
                if (error) {
                    console.log("notification error: ",error);
                }
                else {
                    console.log("Notification send",results);
                }
            });
        

        }
        else {
            console.log("No device Id")
        }

    } catch (error) {
        console.log(error);
    }
}