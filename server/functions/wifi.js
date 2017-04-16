import hostapd from 'wireless-tools/hostapd';
import ifconfig from 'wireless-tools/ifconfig';
import iwconfig from 'wireless-tools/iwconfig';
//import iwlist from 'wireless-tools/iwlist';
//import iw from 'wireless-tools/iw';
//import udhcpc from 'wireless-tools/udhcpc';
import wpa_supplicant from 'wireless-tools/wpa_supplicant';
import SYSINFO from '../main';
import Wireless from './node-wireless/index';
import {
	exec,
	spawn
} from 'child_process';

var WIFI = [];

export const StartWifiIface = (iface, cb) => {

	var wifi = new Wireless({
		iface: iface
	})

	var wireless = {
		iface: iface,
		wifi: wifi
	}

	WIFI.push(wireless)

	wifi.enable((err) => {
		if (err) {
			cb('fail', err)
		}
	})

	/*
		wifi.on('appear', (data, iface) => {
			console.log(data)
		})

		wifi.on('vanish', (data, iface) => {
			//console.log(data)
		})

		wifi.on('signal', (data, iface) => {
			//signal changes
		})

		wifi.on('change', (data, iface) => {
			//properties change
		})

		wifi.on('error', (err, iface) => {
			console.log(err)
		})

		wifi.on('empty', (data, iface) => {
			//empty network scan
		})
		*/
}
export const StopMainWifiIface = (cb) => {
	WIFI.stop(function(data) {
		cb(data)
	})
}

export const CheckIfaceState = (iface, cb) => {
	//needs to check if interface is up and so on
	iwconfig.status(iface, (err, status) => {
		if (err)
			cb('fail', err)
		cb('success', status)
	});
}

export const ScanWifi = (iface, cb) => {}

export const DisconnectWifi = (iface, cb) => {

}

export const CheckAllIfaces = (cb) => {
	iwconfig.status((err, status) => {
		if (err) {
			cb('fail', err)
		} else {
			cb('success', status)
		}
	})
}

export const WPSPixie = (iface, options, cb) => {
	//run wps pixie command on wifi
	//needs error handling (timeout and stuff)
}
export const EnableMonitorMode = (iface, cb) => {

}

export const DisableMonitorMode = (iface, cb) => {

}

export const ConnectToWifi = (iface, options, cb) => {
	/*
	var options = {
	    bssid: xx:xx:xx:xx //optional
	    essid: "FreeWifi"
	    security: {
	        passphrase: "secretpass"
	        type: WPA2
	    }
	}
	*/

}
