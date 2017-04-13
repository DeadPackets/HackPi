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

setInterval(() => {
	UpdateCPUInfo()
	UpdateFSInfo()
	UpdateRAMInfo()
	UpdateSwapInfo()
}, 300)

setInterval(() => {
	UpdateUptime()
}, 1000)

setInterval(() => {
	UpdateInterfaceInfo()
	UpdateInterfaceState()
}, 5000)

export const UpdateInterfaceState = () => {
	for (var i = 0; i < SYSINFO.interfaces.length; i++) {

		//Determine type
		if (SYSINFO.interfaces[i].interface.indexOf('wlan') < 0) {
			SYSINFO.interfaces[i].link = SYSINFO.interfaces[i].link
		} else if (SYSINFO.interfaces[i].interface.indexOf('mon') < 0) {
			SYSINFO.interfaces[i].link = 'wireless'
		} else {
			SYSINFO.interfaces[i].link = 'monitor-mode'
		}
		if (SYSINFO.interfaces[i].status !== undefined) {
			if (SYSINFO.interfaces[i].status.busy !== true) {
				SYSINFO.interfaces[i].status.busy = false
				SYSINFO.interfaces[i].status.process = 'none'
			}
		} else {
			SYSINFO.interfaces[i].status = {
				busy: false,
				process: 'none'
			}
		}

		if (SYSINFO.interfaces[i].connected !== true) {
			SYSINFO.interfaces[i].connected = false
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
			console.log(error)
		}
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

		nmapscan.on('error', (error) => {
			cb('fail', error)
		});
		//Add to interface status array that this iface is now busy with a ping sweep.
		nmapscan.on('complete', (data) => {
			cb('success', data, nmapscan.scanTime)
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
