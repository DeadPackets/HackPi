import Scanner from 'bluetooth-scanner';
import bluetooth from 'bluetooth';
import {
	exec,
	spawn
} from 'child_process';

export const ListBluetoothIfaces = (cb) => {
	//exec hciconfig here
	const listbluetooth = exec('hciconfig')

	listbluetooth.stderr.on('data', (data) => {
		cb('fail', data)
	})

	//catch stdout here
}

export const BluetoothState = (iface, cb) => {
	//todo using bluetooth package

}

export const BluetoothToggle = (iface, cb) => {
	//todo using bluetooth package
}

export const DoSBluetooth = (iface, device, cb) => {
	//Denial of service for bluetooth here
}

export const BluetoothPingFlood = (iface, device, cb) => {
	//Ping flood
}

export const BlueoothPing = (iface, device, cb) => {
	//Ping certain bluetooth device (maybe find approx distance?)
}

export const ScanBluetooth = (iface, cb) => {
	bleScanner = new Scanner(iface, cb, (mac, name) => {
		cb(mac, name) //callback gets executed each time a new device is found
	})
}
