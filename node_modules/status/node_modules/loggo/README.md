**node-log is a simple logger for NodeJS**


## Installation
    
To install node-log, use [npm](http://github.com/isaacs/npm):

        $ npm install node-log

## Usage

node-log will automatically detect the application name via your package.json file or you can specify it at runtime.

```
var log = require('node-log');
log.setName('mysupercoolapp');
log.log('test');
log.error('erruh!');
log.debug('secrecy');
log.warn('watch out bruh');
log.info('seriously watch out');
```
![pic](http://i.imgur.com/ZkzU0.png)

You only need to specify the name once during the start of your application unless you want to change it.

## Contributors

- [Contra](https://github.com/Contra)

## LICENSE

(MIT License)

Copyright (c) 2011 Fractal <contact@wearefractal.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
