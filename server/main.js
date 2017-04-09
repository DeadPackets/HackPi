require("babel-core").transform("code");

import IO from 'socket.io';
import express from 'express';
import https from 'https';
var app = express()
var port = 443
import fs from 'fs';
var options = {
	key: fs.readFileSync(__dirname + '/ssl/server.key'),
	cert: fs.readFileSync(__dirname + '/ssl/server.cert')
};


import {
	Log,
	ScanLocal,
	ScanTarget
} from './functions/fn';

var SYSINFO = {
	cpu: {},
	mem: {},
	fs: {},
	interfaces: {},
	swap: {}
}
export default SYSINFO;

//HTTP SERVER INIT
var server = https.createServer(options, app).listen(port, () => {
	Log.i("Express server listening on port " + port);
});

//STATIC WEB
app.use(express.static(__dirname + '/web'));

//SOCKET.IO INIT
const io = IO(server);

//HTTP GET RULES
app.get('/', (req, res) => {
	Log.d(req.connection.remoteAddress + " GET /")
	res.sendFile(__dirname + '/web/index.html');
});


io.on('connection', (socket) => {

	socket.on('get system info', (callback) => {
		callback(SYSINFO)
	})
	
	socket.on('scan local', (iface, cb) => {
		ScanLocal(iface, cb)
	})
	
	socket.on('scan target', (iface, target, cb) => {
		ScanTarget(iface, target, cb)
	})

})
