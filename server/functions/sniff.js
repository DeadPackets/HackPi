import pcap from 'pcap2';
const INT = 'eth0';

export const ARP = new pcap.Session(INT, { filter: 'arp' } )
export const TCP = new pcap.Session(INT, { filter: 'tcp' } )
export const UDP = new pcap.Session(INT, { filter: 'udp' } )
