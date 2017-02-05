var WifiControl = require('wifi-control');
var settings = {
	iface: 'wlan1'
}
WifiControl.configure(settings)
WifiControl.init(settings)
var ap = {
	ssid: 'GSW1617',
	password: '042888000'
}
/*
WifiControl.scanForWiFi( function(err, response) {
  if (err) console.log(err);
  console.log(response);
});
*/

var results = WifiControl.connectToAP(ap, function(err,response){
if (err) console.log(err)
console.log(response)
})

