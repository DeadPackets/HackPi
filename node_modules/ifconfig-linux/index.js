#!/usr/bin/env node

'use strict'

// var fs = require('fs');
// var parser = require('./ifconfig-parser');

// fs.readFile('./example.ifconfig','utf8', function(err, data) {
//     console.dir(parser(data));
// });

var executeCmd = require('./executeCmd');

executeCmd().then(console.dir);
