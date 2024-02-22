const express = require('express');
const app = express();
exports.jwt = require('jsonwebtoken');
const helmet = require('helmet');
exports.dotenv = require('dotenv').config();
exports.applicationkey = process.env.APPLICATION_KEY;
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
const logger = require("./utilities/logger");
const path = require('path');
const cors = require('cors');

const https = require('https');

var fs = require('fs');
var key = fs.readFileSync("./utilities/webkey.key");
var cert = fs.readFileSync("./utilities/webcert.crt");
var cacert = fs.readFileSync("./utilities/webca.crt");
var options = {
  key: key,
  cert: cert,
    ca: cacert,
  requestCert: false,
  rejectUnauthorized: true
};

var httpsServer = https.createServer(options, app);
const http = require('http')
const server = http.createServer(app);


//routes
const globalRoutes = require('./routes/global');

//const mainService = require('./services/mainService');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
//app.use('/',express.static('./uploads'));
app.use('/static', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

app.all
app.use(helmet());
app.disable('x-powered-by');



//midddlewares 
app.use('/', function timeLog(req, res, next) {
    //this is an example of how you would call our new logging system to log an info message
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey'];//Supportkey 
    var applicationkey = req.headers['applicationkey']

    //if (req.headers['supportkey'])
    //logger.info(req.method + " " + req.url + " ", req.headers['supportkey']);
    console.log(new Date().toLocaleString()," Requested Method : -", req.method, req.url, "public Ip :", req.connection.remoteAddress, "supportkey : ", supportKey);
    // logger.info(supportKey + ' ' + req.method + " " + req.url , applicationkey,deviceid,supportKey);
    next();
});

app.use('/', globalRoutes);


//exports.admin123 = admin123;

//server.listen(port, hostname, () => {
   // console.log('LoanProSys app listening on ', hostname, port, '!');
//});

httpsServer.listen(port, hostname, () => {
  console.log('LoanProSys app listening on ', hostname, port, '!');
})
