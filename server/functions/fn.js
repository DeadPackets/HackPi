import colors from 'colors';
import fs from 'fs';
import si from 'systeminformation';
import { exec } from 'child_process';
import hostapd from 'wireless-tools/hostapd';
import ifconfig from 'wireless-tools/ifconfig';
import iwconfig from 'wireless-tools/iwconfig';
import iwlist from 'wireless-tools/iwlist';
import iw from 'wireless-tools/iw';
import udhcpc from 'wireless-tools/udhcpc';

const secondsToString = (seconds) => {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;
	return numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
}

export const GetCPUInfo = (cb) => {
	si.cpuCurrentspeed(function(speed) {
		si.cpuTemperature(function(temp) {
			si.currentLoad(function(load) {
				cb({ speed, temp, load })
			})
		})
	})
}

export const GetFsInfo = (cb) => {
	var fssize = si.fsSize(function(fssize) {
		var ioinfo = si.disksIO(function(ioinfo){
			var rwinfo = si.fsStats(function(rwinfo){
				cb({ fssize, ioinfo, rwinfo })
			})
		})
	})
}

export const GetInterfaceInfo = () => {
	ifconfig.status((error, data)=>{
		console.log(error, data)
	})
}

export const GetRAMInfo = () => {
	var usedmem = os.totalmem() - os.freemem()
	var result = {
		freemem: os.freemem(),
		totalmem: os.totalmem(),
		usedmem: usedmem
	}
	return result
}

export const GetSwapInfo = () => {
	var swapinfo = si.mem(function(data) {
		return data
	})
}

export const GetUptime = () => {
	return secondsToString(os.uptime())
}

/*export const ListHostapdClients = () => {

}*/

export const RebootSystem = () => {
	exec('shutdown -r now')
}

export const ShutdownSystem = () => {
	exec('shutdown -P now')
}

export const Log = {
	e: function(data) {
		var date = new Date();
		console.log('ERROR'.red, data);
	},
	i: function(data) {
		var date = new Date();
		console.log('INFO'.green, data);
	},
	w: function(data) {
		var date = new Date();
		console.log('WARN'.yellow, data);
	},
	d: function(data) {
		console.log('DEBUG'.blue, data);
	}
}
