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
- Reboot functions
- Shutdown (kill all processes related to HackPi and close main NodeJS) //Needs work
- Hostapd clients connected
- Interface identification
- Process killing (HackPi related)
*/

/*
In Progress:
*/

var os = require('os');
var wifi = require('wifi');
var express = require('express');
const colors = require('colors');
var app = express();
var https = require('https')
var fs = require('fs');
var auth = require('basic-auth');
var si = require('systeminformation');
//var config = require(__dirname + '/config/config.json') //not needed for now
var exec = require('child_process').exec;
var port = 1337;
var ttyport = 13370;
var options = {
	key: fs.readFileSync(__dirname + '/ssl/server.key'),
	cert: fs.readFileSync(__dirname + '/ssl/server.cert')
};

//Wireless tools
var hostapd = require('wireless-tools/hostapd');
var ifconfig = require('wireless-tools/ifconfig');
var iwconfig = require('wireless-tools/iwconfig')
var iwlist = require('wireless-tools/iwlist');
var iw = require('wireless-tools/iw');
var udhcpc = require('wireless-tools/udhcpc');
var wpa_supplicant = require('wireless-tools/wpa_supplicant');


//Global variables
var interfaces;
var uptime;
var ifaces = [];
var cpuinfo = {}
var raminfo = {}
var fsinfo = {}
var swapinfo = {}
var sysinfo = {}
	/*
		const mysql = require('mysql');
		var sql = mysql.createConnection({host: 'localhost', user: 'root', password: 'mypass', database: 'mydb'});
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

setInterval(function() {
	GetCPUInfo()
	GetFsInfo()
	GetRAMInfo()
	GetSwapInfo()
	GetUptime()
	sysinfo = {
		cpuinfo: cpuinfo,
		raminfo: raminfo,
		fsinfo: fsinfo,
		swapinfo: swapinfo,
		uptime: uptime
	}
}, 1000)

//Functions
function secondsToString(seconds) {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;
	return numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
}


function GetCPUInfo() {
	si.cpuCurrentspeed(function(data) {
		cpuinfo.currentspeed = data
	})
	si.cpuTemperature(function(data) {
		cpuinfo.cputemp = data
	})
	si.currentLoad(function(data) {
		cpuinfo.currentload = data
	})
}


function GetFsInfo() {
	si.fsSize(function(data) {
		fsinfo.fsSize = data
	})
	si.disksIO(function(data) {
		fsinfo.ioinfo = data
	})
	si.fsStats(function(data) {
		fs.rwinfo = data
	})
}

function GetInterfaceInfo() {
	ifconfig.status(function(err, status) {
		interfaces = status
		for (var i = 0; i < status.length; i++) {
			iwconfig.status(status[i].interface, function(err, iface) {
				if (iface) {
					//do wireless code here
				}
			});
		}
	})
}
GetInterfaceInfo()

function BringIfaceDown(callback) {
	//todo
}

function BringIfaceUp(callback) {
	//todo
}

function ScanWiFi(interface) {
	if (interface == 'wlan0') {
		//deny, since wlan0 is in monitor mode
	} else {
		//todo
	}
}

function ConnectToWifi(interface, mac, ssid) {
	//todo
}

function GetRAMInfo() {
	raminfo.freemem = os.freemem()
	raminfo.totalmem = os.totalmem()
	raminfo.usedmem = os.totalmem() - os.freemem()
}

function GetSwapInfo() {
	si.mem(function(data) {
		swapinfo.swapinfo = data
	})
}

function GetUptime() {
	uptime = secondsToString(os.uptime())
}

function ListHostapdClients() {
	//still thinking about this, should it be fixed for wlan0 or should it be flexible?
}

function RebootSystem() {
	exec('shutdown -r now')
}

function ShutdownSystem() {
	exec('shutdown -P now')
}

var server = https.createServer(options, app).listen(port, function() {
	log.info("Express server listening on port " + port);
});

//SOCKET.IO INIT
var io = require('socket.io')(server)

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
      res.setHeader('WWW-Authenticate', 'Basic realm="auth"')
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
	log.info(socket.handshake.address + " has connected.") //is this needed? should we log to a file?


	socket.on('system info', function() {
		socket.emit('system info results', sysinfo)
	})
	socket.on('interfaces list', function() {
		GetInterfaceInfo()
		socket.emit('interfaces result', interfaces)
	})

	socket.on('disconnect', function() {
		log.warn(socket.handshake.address + " has disconnected.") //needed? or log to file instead?
	})

})