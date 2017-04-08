require("babel-core").transform("code");

import IO from 'socket.io';

import {
	GetUptime,
	GetRAMInfo,
	GetSwapInfo,
	GetCPUInfo,
	GetFsInfo,
	GetInterfaceInfo,
	Log
} from './functions/fn';

const io = IO(8080);

io.on('connection', (socket) => {

	socket.on('get system info', (callback) => {

	})

})

GetInterfaceInfo()
