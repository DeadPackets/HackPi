import colors from 'colors';
import fs from 'fs';
import si from 'systeminformation';
import os from 'os';
import ifconfig from 'wireless-tools/ifconfig'
import SYSINFO from '../main';
import {
	exec,
	spawn
} from 'child_process';
import nmap from 'node-nmap';
import xml2js from 'xml2js';
import ip from 'ip';

var INTERFACE_STATE = [];
export default INTERFACE_STATE;

setInterval(() => {
	//i should probably change this, eeh, later
	//Shouldnt we call them in order? Why nested?
	UpdateCPUInfo()
	UpdateFSInfo()
	UpdateRAMInfo()
	UpdateInterfaceInfo()
	UpdateSwapInfo()
	UpdateUptime()
}, 500)


export const UpdateInterfaceState = () => {
	for (var i = 0; i < SYSINFO.interfaces.length; i++) {

		//init
		var iface = SYSINFO.interfaces[i]
		var type = ''

		//Determine type
		if (iface.interface.indexOf('wlan') < 0) {
			type = iface.link
		} else if (iface.interface.indexOf('mon') < 0) {
			type = 'wireless'
		} else {
			type = 'monitor-mode'
		}

		//put results in place
		var result = {
			interface: iface.interface,
			type: type,
			mac: iface.address || null,
			busy: false,
			status: false,
			connected: false,
			isup: iface.up
		}
		INTERFACE_STATE.push(result)
		console.log("i", i)
		console.log('iface', INTERFACE_STATE)
		/*
				//push to global array
				for (var i = 0; i < INTERFACE_STATE.length; i++) {
					console.log('inner', i)

					if (INTERFACE_STATE[i].interface == iface.interface) {
						console.log("Duplicate result ignored")
					} else {
						INTERFACE_STATE.push(result)
					}
				}
		*/

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
		SYSINFO.interfaces = interfaces
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
	var index;
	for (var i = 0; i < INTERFACE_STATE.length; i++) {
		if (INTERFACE_STATE[i].interface.indexOf(iface) < 0) {} else {
			INTERFACE_STATE[i].busy = true
			INTERFACE_STATE[i].state = "Targeted port scanning on " + target
			index = i
		}
	}
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
		INTERFACE_STATE[index].busy = false
		INTERFACE_STATE[index].state = false
		//Reminder to add delete function here
	})
}
export const ScanLocal = (iface, cb) => {
	var localrange;
	ifconfig.status(iface, (err, status) => {
		if (err)
			cb('fail', err)
		var subnet = ip.subnet(status.ipv4_address, status.ipv4_subnet_mask).subnetMaskLength
		localrange = status.ipv4_address + '/' + subnet
		var nmapscan = new nmap.nodenmap.NmapScan(localrange, '-sn', '-T4', '--max-retries 1', '-e ' + iface);
		console.log("Created new scan", localrange)

		var index;
		for (var i = 0; i < INTERFACE_STATE.length; i++) {
			if (INTERFACE_STATE[i].interface.indexOf(iface) < 0) {} else {
				INTERFACE_STATE[i].busy = true
				INTERFACE_STATE[i].state = "Local port scan on " + localrange
				index = i
			}
		}

		nmapscan.on('error', (error) => {
			cb('fail', error)
		});
		//Add to interface status array that this iface is now busy with a ping sweep.
		nmapscan.on('complete', (data) => {
			cb('success', data, nmapscan.scanTime)
			INTERFACE_STATE[index].busy = false
			INTERFACE_STATE[index].state = false
		})

		nmapscan.startScan()
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
