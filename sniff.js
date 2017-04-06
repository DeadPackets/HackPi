var pcap = require('pcap2')
var ARP_PACKETS = new pcap.Session('wlan0', { filter: 'arp' } )
var TCP_PACKETS = new pcap.Session('wlan0', { filter: 'tcp' } )
var UDP_PACKETS = new pcap.Session('wlan0', { filter: 'udp' } )

TCP_PACKETS.on('packet', function(rawPacket){console.log("TCP")})

ARP_PACKETS.on('packet', function(rawPacket){ 
//console.log(pcap.decode.packet(rawPacket).payload.payload); 
console.log("ARP")
})

UDP_PACKETS.on('packet', function(rawPacket){console.log("UDP")})
