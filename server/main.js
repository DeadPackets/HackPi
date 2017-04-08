require("babel-core").transform("code");

import IO from 'socket.io';

import {
	Log
} from './functions/fn';

var SYSINFO = {
	cpu: {},
	mem: {},
	fs: {},
	interfaces: {},
	swap: {}
}
export default SYSINFO;

const io = IO(8080);

io.on('connection', (socket) => {

	socket.on('get system info', (callback) => {
		callback(SYSINFO)
	})

})
