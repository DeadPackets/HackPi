var pcap = require('pcap2')
var interface = 'eth0'
var ARP_PACKETS = new pcap.Session(interface, { filter: 'arp' } )
var TCP_PACKETS = new pcap.Session(interface, { filter: 'tcp' } )
var UDP_PACKETS = new pcap.Session(interface, { filter: 'udp' } )

TCP_PACKETS.on('packet', function(rawPacket){console.log("TCP")})

ARP_PACKETS.on('packet', function(rawPacket){ 
//console.log(pcap.decode.packet(rawPacket).payload.payload); 
console.log("ARP")
})

UDP_PACKETS.on('packet', function(rawPacket){console.log("UDP")})
