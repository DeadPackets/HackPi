/*
HackPi


TODO:
- Add mass Wifi Jamming
- Add mass WPSPixie/WEP hacking
- Add RogueAP setup
- karma for RogueAP
- Add Bluetooth scanning + jacking
- Add Interface Bridging
- Login to Web Console
- Security?
- System Info
- Reboot functions
- Shutdown (kill all processes related to HackPi and close main NodeJS)
- Hostapd clients connected
- Interface identification
- Commandline
- Process killing (HackPi related)
*/
var os = require('os');
var wifi = require('wifi');
var express = require('express');
const colors = require('colors');
var app = express();
var http = require('http')
var https = require('https')
var fs = require('fs');
var auth = require('basic-auth');
//var port = 443;
var httpport = 80;
/*var options = {
    key: fs.readFileSync('privkey/goes/here/privkey.pem'),
    cert: fs.readFileSync('cert/goes/here/cert.pem')
};
const mysql = require('mysql');
var sql = mysql.createConnection({host: 'localhost', user: 'root', password: 'mypass', database: 'mydb'});

//Prevents MySQL Database from dying
setInterval(function() {
    sql.query('SELECT 1');
}, 10000);

*/
//Logging functions
var log = {
    error: function(data) {
        var date = new Date();
        console.log('ERROR'.red, data);
    },
    info: function(data) {
        var date = new Date();
        console.log('INFO'.green, data);
    },
    warn: function(data) {
        var date = new Date();
        console.log('WARN'.yellow, data);
    },
    debug: function(data) {
        console.log('DEBUG'.blue, data);
    }
}

//Functions
function GetInterfaceInfo(){

}

function GetUptime(){

}

function ListHostapdClients(){
  
}

//Starting up HTTP and HTTPS
//var server = https.createServer(options, app).listen(port, function() {
//    log.info("Express server listening on port " + port);
//});

var serverhttp = http.createServer(app).listen(httpport, function() {
    log.info("Express server listening on port " + httpport);
});
serverhttp.listen(80);

//SOCKET.IO INIT
var io = require('socket.io')(serverhttp) //CHANGE TO SECURE LATER

/*app.use(function(req, res, next) {
    if (req.secure) {
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url); //req.headers.host
        log.debug("Redirected" + req.connection.remoteAddress + " to HTTPS.");
    }
});*/

app.use(express.static(__dirname + '/web'));

app.get('/', function(req, res) {
    log.debug(req.connection.remoteAddress + " GET /")
    res.sendFile('web/index.html');
});

/*
//HTTP AUTH EXAMPLE
app.get('/auth', function(req, res) {
    var credentials = auth(req)
    if (!credentials || credentials.name !== 'username' || credentials.pass !== 'password') {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="example"')
      res.end('Access denied')
    } else {
      log.debug(req.connection.remoteAddress + " GET /auth")
      res.sendFile('files');
  }
});
*/

//Custom 404
app.use(function(req, res) {
    res.send('404: Page not Found').status(404);
    log.warn(req.connection.remoteAddress + " [404] GET " + req.url)
});

io.on('connection', function(socket, next) {
    log.info(socket.handshake.address + " has connected.")
})

