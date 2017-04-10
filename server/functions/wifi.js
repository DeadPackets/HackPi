import hostapd from 'wireless-tools/hostapd';
import ifconfig from 'wireless-tools/ifconfig';
import iwconfig from 'wireless-tools/iwconfig';
import iwlist from 'wireless-tools/iwlist';
import iw from 'wireless-tools/iw';
import udhcpc from 'wireless-tools/udhcpc';

export const CheckIfaceState = (interface, cb) => {
  //needs to check if interface is up and so on
  iwconfig.status(interface, (err, status) => {
    if (err)
      cb('fail', err)
    cb('success', status)
  });
}

export const ScanWifi = (interface, cb) => {
  //wireless check + scan here
  iwlist.scan({
    iface: interface,
    show_hidden: true
  }, function(err, networks) {
    if (err)
      cb('fail', err)
    cb('sucecss', networks);
  });
}

export const DisconnectWifi = (iface, cb) => {
  //simply turn interface off or actully disconnect
  wpa_supplicant.disable(iface, (err) => {
    if (err)
      cb('fail', err)
    cb("success")
  });
}

export const WPSPixie = (iface, wifi, cb) => {
  //run wps pixie command on wifi
  //needs error handling
}

export const ConnectToWifi = (iface, wifi, cb) => {
  /*
  var wifi = {
      bssid: xx:xx:xx:xx
      essid: "FreeWifi"
      security: {
          passphrase: "secretpass"
          type: WPA2
      }
  }
  */
  if (wifi.security.type !== 'open') {
    if (wifi.security == 'wep') {
      //connect to WEP
    } else {
      //connect to WPA/WPA2
      var options = {
        interface: iface,
        ssid: wifi.essid,
        passphrase: wifi.security.passphrase,
        driver: 'wext'
      };
      wpa_supplicant.enable(options, (err) => {
        if (err)
          cb('fail', err)
        cb('success')
      });
    }
  } else {
    //Connect to OPEN
  }

}