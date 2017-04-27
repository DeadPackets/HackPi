import colors from 'colors';
import fs from 'fs';
import si from 'systeminformation';
import os from 'os';
import ifconfig from 'wireless-tools/ifconfig'
import SYSINFO from '../main';
import _ from 'underscore';
import {
	exec,
	spawn
} from 'child_process';
import nmap from 'node-nmap';
import xml2js from 'xml2js';
import ip from 'ip';

var IFCONFIG_IFACES = [];
var TRACK_IFACES = [];
var IFACES_STATE = [];
export default IFACES_STATE;
/*

Global object method

var IFACES_STATE = {
ifaces: [],
state: [{}, {}]
}
*/

setInterval(() => {
	UpdateCPUInfo()
	UpdateFSInfo()
	UpdateRAMInfo()
	UpdateSwapInfo()
}, 300)

setInterval(() => {
	UpdateInterfaceInfo()
}, 100)

setInterval(() => {
	UpdateUptime()
}, 1000)

setInterval(() => {
	UpdateInterfaceState()
}, 500)

var firstrun = true;
export const UpdateInterfaceState = () => {
	if (firstrun == true) {
		//running for the first time, push all interfaces to global array
		IFCONFIG_IFACES.forEach((data, index) => {
			TRACK_IFACES.push(data)
			var obj = {
				interface: data,
				state: {
					busy: false,
					process: 'none'
				}
			}
			IFACES_STATE.push(obj)
			console.log("Added interface " + data + "!")
		})
		//not first time anymore
		firstrun = false
	} else {
		//this isnt the first time this function is run
		if (IFCONFIG_IFACES.length > TRACK_IFACES.length) {
			//new interface plugged in
			var diff = _.difference(IFCONFIG_IFACES, TRACK_IFACES) //returns new interface name
			diff.forEach((data, index) => {
				console.log("Interface " + data + " was added.", TRACK_IFACES)
				TRACK_IFACES.push(data)
				var obj = {
					interface: data,
					state: {
						busy: false,
						process: 'none'
					}
				}
				IFACES_STATE.push(obj)
				console.log(TRACK_IFACES)
			})
		} else if (IFCONFIG_IFACES.length < TRACK_IFACES.length) {
			//interface disconnected
			var diff = _.difference(TRACK_IFACES, IFCONFIG_IFACES) //returns interface that was disconnected
			diff.forEach((data, index) => {
				console.log("Interface " + data + " was removed.", TRACK_IFACES)
				var i = TRACK_IFACES.indexOf(data)
				TRACK_IFACES.splice(i, 1)
				IFACES_STATE.splice(i, 1)
				console.log(TRACK_IFACES)
			})
		}
		/*

		//Reason this is commented out is, I expected monitor mode to rename interfaces into mon0 and such, turns out it simply just adds a new iface.
		//I might add this for compatability with other distros later.

		TRACK_IFACES.forEach((data, index) => {
			if (TRACK_IFACES[index] == IFACES_STATE[index].interface) {
				//console.log("Nothing wrong here.")
			} else {
				console.log("Interface " + IFACES_STATE[index].interface + " was renamed to " + TRACK_IFACES[index] + "!")
			}
		})
		*/
	}
}
}

export const secondsToString = (seconds) => {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;
	return numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
}

export const UpdateCPUInfo = () => {
	si.cpuCurrentspeed(function(speed) {
		si.cpuTemperature(function(temp) {
			si.currentLoad(function(load) {
				SYSINFO.cpu = {
					speed,
					temp,
					load
				}
			})
		})
	})
}

export const UpdateFSInfo = () => {
	var fssize = si.fsSize(function(fssize) {
		var ioinfo = si.disksIO(function(ioinfo) {
			var rwinfo = si.fsStats(function(rwinfo) {
				SYSINFO.fs = {
					fssize,
					ioinfo,
					rwinfo
				}
			})
		})
	})
}

export const UpdateInterfaceInfo = () => {

	ifconfig.status((error, interfaces) => {
		if (error) {
			console.log("Error!")
		}
		if (interfaces) {
			SYSINFO.interfaces = interfaces
			IFCONFIG_IFACES = []
			interfaces.forEach((data, index) => {
				IFCONFIG_IFACES.push(data.interface)
			})
		}
	})

}

export const UpdateRAMInfo = () => {
	var usedmem = os.totalmem() - os.freemem()
	SYSINFO.mem = {
		free: os.freemem(),
		total: os.totalmem(),
		used: usedmem
	}
}

export const UpdateSwapInfo = () => {
	var swapinfo = si.mem(function(data) {
		SYSINFO.swap = data;
	})
}

export const UpdateUptime = () => {
	SYSINFO.osuptime = secondsToString(os.uptime())
	SYSINFO.uptime = secondsToString(process.uptime())
}

export const Reboot = () => {
	exec('shutdown -r now')
}

export const Shutdown = () => {
	exec('shutdown -P now')
}

export const ScanTargetPort = (iface, target, port, cb) => {
	//scan target for certain ports (cuz why not?)
}
export const ScanNetworkPort = (iface, port, cb) => {
	//scan entire local network for port or array of ports
}

export const ScanTarget = (iface, target, cb) => {

	var parser = new xml2js.Parser();
	const scan = exec('nmap -sS -sV -T4 -Pn --max-retries 2 -O --min-rate 300 --no-stylesheet -oX /root/' + target + '.xml -e ' + iface + ' ' + target)
	console.log("Scan started!")
	scan.stderr.on('data', (data) => {
		cb('fail', data)
	});
	scan.on('exit', () => {
		fs.readFile('/root/' + target + '.xml', (err, data) => {
			if (err)
				cb('fail', err)
			parser.parseString(data, (err, result) => {
				if (err)
					cb('fail', err)
				cb('success', result)
				console.log('Done');
			});
		});
		//delete xml scan result when done
		fs.unlink('/root' + target + '.xml', (err) => {
			if (err)
				console.log(err)
		})
	})
}
export const ScanLocal = (iface, cb) => {
	var localrange;
	ifconfig.status(iface, (err, status) => {
		if (err)
			cb('fail', err)
		var check = TRACK_IFACES.indexOf(iface)
		if (IFACES_STATE[check].state.busy == false) {
			var subnet = ip.subnet(status.ipv4_address, status.ipv4_subnet_mask).subnetMaskLength
			localrange = status.ipv4_address + '/' + subnet

			IFACES_STATE[check].state.busy = true
			IFACES_STATE[check].state.process = "Local nmap scan of range " + localrange

			var nmapscan = new nmap.nodenmap.NmapScan(localrange, '-sn', '-T4', '--max-retries 1', '-e ' + iface);
			console.log("Created new scan", localrange)

			nmapscan.on('error', (error) => {
				cb('fail', error)
			});
			//Add to interface status array that this iface is now busy with a ping sweep.
			nmapscan.on('complete', (data) => {
				IFACES_STATE[check].state.busy = false
				IFACES_STATE[check].state.process = 'none'
				cb('success', data, nmapscan.scanTime)
			})

			nmapscan.startScan()
		} else {
			cb("Cannot use specified interface, it is busy.", iface, IFACES_STATE[check].state.process) //TODO: change to normal syntax
		}
	})

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
