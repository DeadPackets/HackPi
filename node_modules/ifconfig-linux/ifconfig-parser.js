'use strict'

var _ = require('underscore');

// return array of block. block=array of lines belongs to 1 network device
function breakIntoBlocks(fullText) {
    var blocks = [];
    var lines = fullText.split('\n');
    var currentBlock = [];
    lines.forEach(function(line) {
        if (line.length > 0 && ['\t', ' '].indexOf(line[0]) === -1 && currentBlock.length > 0) { // start of a new block detected
            blocks.push(currentBlock);
            currentBlock = [];
        }
        if (line.trim()) {
            currentBlock.push(line);
        }
    });
    if (currentBlock.length > 0) {
       blocks.push(currentBlock); 
    }
    return blocks;
}

// input:
// eth0      Link encap:Ethernet  HWaddr 04:01:d3:db:fd:01  
//           inet addr:107.170.222.198  Bcast:107.170.223.255  Mask:255.255.240.0
//           inet6 addr: fe80::601:d3ff:fedb:fd01/64 Scope:Link
//           UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
//           RX packets:50028 errors:0 dropped:0 overruns:0 frame:0
//           TX packets:50147 errors:0 dropped:0 overruns:0 carrier:0
//           collisions:0 txqueuelen:1000 
//           RX bytes:13590446 (13.5 MB)  TX bytes:14465813 (14.4 MB)
function parseSingleBlock(block) {
    var data = {};
    block.forEach(function(line) {
        var match = null;
        if(match = line.match(/^(\S+)\s+Link/)) { // eth0      Link encap:Ethernet  HWaddr 04:01:d3:db:fd:01 
            data.device = match[1]; // eth0
            var link = {};
            match = line.match(/encap:(\S+)/);
            if (match) {
                link.encap = match[1];
            }
            match = line.match(/HWaddr\s+(\S+)/);
            if (match) {
                link.hwaddr = match[1];
            }
            data.link = link;
        } else if(match = line.match(/^\s+inet\s+/)) { // inet addr:107.170.222.198  Bcast:107.170.223.255  Mask:255.255.240.0
            var inet = {};
            if (match = line.match(/addr:(\S+)/)) {
                inet.addr = match[1];
            }
            if (match = line.match(/Bcast:(\S+)/)) {
                inet.bcast = match[1];
            }
            if (match = line.match(/Mask:(\S+)/)) {
                inet.mask = match[1];
            }
            data.inet = inet;
        } else if(match = line.match(/^\s+inet6\s+/)) { // inet6 addr: fe80::601:d3ff:fedb:fd01/64 Scope:Link
            var inet6 = {};
            if (match = line.match(/addr:\s+(\S+)/)) {
                inet6.addr = match[1];
            }
            if (match = line.match(/Scope:(\S+)/)) {
                inet6.scope = match[1];
            }
            data.inet6 = inet6;
        } else if(match = line.match(/^\s+RX\s+packets/)) { // RX packets:50028 errors:0 dropped:0 overruns:0 frame:0
            var section = {};
            if (match = line.match(/packets:(\S+)/)) {
                section.packets = parseInt(match[1]);
            }
            if (match = line.match(/errors:(\S+)/)) {
                section.errors = parseInt(match[1]);
            }
            if (match = line.match(/dropped:(\S+)/)) {
                section.dropped = parseInt(match[1]);
            }
            if (match = line.match(/overruns:(\S+)/)) {
                section.overruns = parseInt(match[1]);
            }
            if (match = line.match(/frame:(\S+)/)) {
                section.frame = parseInt(match[1]);
            }
            data.rx = section;
        } else if(match = line.match(/^\s+TX\s+packets/)) { // TX packets:50147 errors:0 dropped:0 overruns:0 carrier:0
            var section = {};
            if (match = line.match(/packets:(\S+)/)) {
                section.packets = parseInt(match[1]);
            }
            if (match = line.match(/errors:(\S+)/)) {
                section.errors = parseInt(match[1]);
            }
            if (match = line.match(/dropped:(\S+)/)) {
                section.dropped = parseInt(match[1]);
            }
            if (match = line.match(/overruns:(\S+)/)) {
                section.overruns = parseInt(match[1]);
            }
            if (match = line.match(/carrier:(\S+)/)) {
                section.carrier = parseInt(match[1]);
            }
            data.tx = section;
        } else {
            var section = data.other || {};
            if (match = line.match(/collisions:(\S+)/)) {
                section.collisions = parseInt(match[1]);
            }
            if (match = line.match(/txqueuelen:(\S+)/)) {
                section.txqueuelen = parseInt(match[1]);
            }
            if (match = line.match(/RX bytes:(\S+)/)) {
                section.rxBytes = parseInt(match[1]);
            }
            if (match = line.match(/TX bytes:(\S+)/)) {
                section.txBytes = parseInt(match[1]);
            }
            data.other = section;
        }
    });
    return data;
}

// return a well-parsed object
function parser(fullText) {
    var blocks = breakIntoBlocks(fullText);
    var map = {};
    _.map(blocks, function(block) {
        var obj = parseSingleBlock(block);
        map[obj.device] = obj;
    });

    return map;
}

module.exports = parser;