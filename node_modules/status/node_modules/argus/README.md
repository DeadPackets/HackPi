![status](https://secure.travis-ci.org/wearefractal/argus.png?branch=master)

## Information

<table>
<tr> 
<td>Package</td><td>argus</td>
</tr>
<tr>
<td>Description</td>
<td>Complex CLI argument parser</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

## Details

Argus allows you to pass an array of complex data to your application through a CLI. This can be an array of objects, strings, numbers, you name it. Anything valid JSON array can be used.

## Usage

```coffee-script
# You can pass an array of JSON values
mycli dostuff["johnny boy",true,-1] # {"dostuff":["johnny boy",true,-1]}

# You can set it to a single JSON value
mycli dostuff=true # {"dostuff":true} 

# You can mix single and multi-value commands
mycli dostuff=true:otherstuff[true,2.05,"test"] # {"dostuff":true, "otherstuff":[true,2.05,"test"]}

# Non-JSON arguments used with = will be turned into strings
mycli dostuff=testlol # {"dostuff":"testlol"}
```

## Quirks

Bash doesn't agree with a lot of JSON characters so some escaping may be required. Still looking for a solution to this.

## LICENSE

(MIT License)

Copyright (c) 2012 Fractal <contact@wearefractal.com>

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


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/wearefractal/argus/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

