require("babel-core").transform("code");

import IO from 'socket.io';
import express from 'express';
import https from 'https';
var app = express()
var port = 1337 //change this to 1337 once dev is done (its 443 because I dev at school) (Should we turn this into a config controlled port?)
import fs from 'fs';
var options = {
	key: fs.readFileSync(__dirname + '/ssl/server.key'),
	cert: fs.readFileSync(__dirname + '/ssl/server.cert')
};

/*

EXAMPLE OF GLOBAL TRACKING OBJECT
---------------------------------

var obj = {
	interface: 'wlan0',
	mac: 'mac of card',
	type: 'wireless',
	status: {
		busy: false,
		process: null //due to busy being false
	},
	isup: true, //interface is up
	connected: false //not connected to wifi, not neccessarily busy yknow?
}

var ob2 = {
	interface: 'wlan1',
	type: 'wireless',
	status: {
		busy: true,
		process: {
			type: 'WIFI_DOS', ///could be anything, MiTM, MASS_JAM, WPS_ATTACK, SCANNING and so on
			bssid: 'mac address of attacked wifi point',
			essid: 'ssid of attacked wifi point'
		}
	},
	isup: true,
	connected: false //not connected
}

var obj3 = {
	interface: 'wlan2',
	type: 'wireless',
	status: {
		busy: false,
		process: null
	},
	isup: true,
	connected: {
		bssid: 'mac of connected access point',
		essid: 'name of connected access point',
		ip: 'ip of interface related to that access point (private ip)',
		router: 'ip of router/gateway'
	}
}

*/
var SYSINFO = {
	cpu: {},
	mem: {},
	fs: {},
	interfaces: {},
	swap: {}
}
export default SYSINFO;

import {
	Log,
	ScanLocal,
	ScanTarget,
	UpdateInterfaceState
} from './functions/fn';

import IFACES_STATE from './functions/fn';

import {
	ScanWifi,
	CheckIfaceState,
	DisconnectWifi,
	CheckAllIfaces,
	ConnectToWifi,
} from './functions/wifi';

import bluetooth from './functions/bluetooth';
import wifi from './functions/wifi';


//export default INTERFACE_STATE

//HTTP SERVER INIT
var server = https.createServer(options, app).listen(port, () => {
	Log.i("HTTPS server listening on port " + port);
});

//STATIC WEB
app.use(express.static(__dirname + '/web'));

//SOCKET.IO INIT
const io = IO(server);

//HTTP GET RULES
app.get("/", (req, res) => {
	Log.d(req.connection.remoteAddress + " GET " + req.params[0]);
	res.sendFile(__dirname + '/web/index.html')
})


app.get(/^(.+)$/, (req, res) => {
	Log.d(req.connection.remoteAddress + " GET " + req.params[0]);
	res.sendFile(__dirname + "/web" + req.params[0]);
});


io.on('connection', (socket) => {

	socket.on('get system info', (callback) => {
		callback(SYSINFO)
		UpdateInterfaceState()
	})

	socket.on('get interface state', (callback) => {
		callback(IFACES_STATE)
	})

	socket.on('scan local', (iface, cb) => {
		ScanLocal(iface, cb)
	})

	socket.on('scan target', (iface, target, cb) => {
		ScanTarget(iface, target, cb)
	})

	socket.on('scan wifi', (iface) => {
		ScanWifi(iface, function(state, data) {
			socket.emit('new wifi', state, data)
		})
	})

	socket.on('list wireless', (cb) => {
		CheckAllIfaces(cb)
	})

	socket.on('check wireless', (iface, cb) => {
		CheckIfaceState(iface, cb)
	})

	socket.on('connect wifi', (iface, options, cb) => {
		ConnectToWifi(iface, options, cb)
	})

	socket.on('disconnect wifi', (iface, cb) => {
		DisconnectWifi(iface, cb)
	})


	socket.on('scan bluetooth', (iface) => {
		//bluetooth scanning here
	})

	socket.on('stop bluetooth', (iface) => {
		//stop bluetooth here
	})

	socket.on('dos bluetooth', (iface, options) => {
		//options
		/*
		{
		type: "dos",
		target_mac: "XX:XX:XX:XX",
		other: "blah blah"
	}
		*/
		//run funtion here
	})

	//evades captive portal
	socket.on('evade portal', (iface) => {

	})

	//tests internet connectivity
	socket.on('test upstream', (iface) => {

	})
})
