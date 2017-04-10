import Scanner from 'bluetooth-scanner';
import bluetooth from 'bluetooth';

export const BluetoothState = (iface, cb) => {
	//todo using bluetooth package
}

export const BluetoothToggle = (iface, cb) => {
	//todo using bluetooth package
}

export const BluetoothToggle = (iface, cb) => {
	//todo using bluetooth package
}




export const ScanBluetooth = (iface, cb) => {
	bleScanner = new Scanner(iface, cb, (mac, name) => {
		cb(mac, name) //callback gets executed each time a new device is found
	})
}
