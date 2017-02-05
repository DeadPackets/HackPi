# ifconfig-linux

Wrap ifconfig and parse result to json format (work on linux, not work on mac).


# Command-line Example
``` js
root@ubuntu-2gb-sfo1-01:~# ifconfig-linux
{ eth0: 
   { device: 'eth0',
     link: { encap: 'Ethernet', hwaddr: '04:01:d3:db:fd:01' },
     inet: 
      { addr: '107.170.222.198',
        bcast: '107.170.223.255',
        mask: '255.255.240.0' },
     inet6: { addr: 'fe80::601:d3ff:fedb:fd01/64', scope: 'Link' },
     other: 
      { collisions: 0,
        txqueuelen: 1000,
        rxBytes: 17278968,
        txBytes: 19145675 },
     rx: { packets: 71118, errors: 0, dropped: 0, overruns: 0, frame: 0 },
     tx: { packets: 69479, errors: 0, dropped: 0, overruns: 0, carrier: 0 } },
  lo: 
   { device: 'lo',
     link: { encap: 'Local' },
     inet: { addr: '127.0.0.1', mask: '255.0.0.0' },
     inet6: { addr: '::1/128', scope: 'Host' },
     other: 
      { collisions: 0,
        txqueuelen: 0,
        rxBytes: 30545056,
        txBytes: 30545056 },
     rx: { packets: 170494, errors: 0, dropped: 0, overruns: 0, frame: 0 },
     tx: { packets: 170494, errors: 0, dropped: 0, overruns: 0, carrier: 0 } } }
```

# API Example
In addition to ifconfig-linux shell command-line, you can also `require('ifconfig-linux')` from your node.js application as you wish.
``` js
var promise = require('ifconfig-linux')(); // this return a promise
promise.then(console.dir);
```

# How it works
This module is based on `ifconfig` linux command. It's tested and works on Ubuntu 14.04.4

# install

With [npm](https://npmjs.org) do:

```
npm install ifconfig-linux -g
```

# license

MIT
