![status](https://secure.travis-ci.org/wearefractal/xemplar.png?branch=master)

## Information

<table>
<tr> 
<td>Package</td><td>xemplar</td>
</tr>
<tr>
<td>Description</td>
<td>Community collection of RegEx patterns</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

## Usage

```
var patterns = require('xemplar');
```

```js
var patterns = require('xemplar');
var actual = 'some text with words';
var regexp = patterns.text.words;

console.log(actual.match(regexp));
console.log(regexp.exec(actual));
```


## Patterns so far

#### {Object} text
- **{RegExp}** `words`
- **{RegExp}** `nonblank`
- **{RegExp}** `trim`
- **{RegExp}** `ltrim`
- **{RegExp}** `rtrim`

#### {Object} number
- **{RegExp}** `percent`
- **{RegExp}** `all`
- **{RegExp}** `negative`
- **{RegExp}** `positive`

#### {Object} information
- **{RegExp}** `email`
- **{RegExp}** `phone`
- **{RegExp}** `credit_card`
- **{RegExp}** `zip_code`

#### {Object} time
- **{RegExp}** `gmt`
- **{RegExp}** `military`
- **{RegExp}** `standard`
- **{RegExp}** `date`
- **{RegExp}** `date_time`
- **{RegExp}** `month`

#### {Object} technology
- **{Object}** `frequency`
  + **{RegExp}** `all`
  + **{RegExp}** `thz`
  + **{RegExp}** `ghz`
  + **{RegExp}** `mhz`
  + **{RegExp}** `khz`
  + **{RegExp}** `hz`
- **{Object}** `size`
  + **{RegExp}** `all`
  + **{RegExp}** `tb`
  + **{RegExp}** `gb`
  + **{RegExp}** `mb`
  + **{RegExp}** `kb`
  + **{RegExp}** `b`

#### {Object} security
- **{Object}** `xss`
  + **{RegExp}** `simple`
  + **{RegExp}** `img`
  + **{RegExp}** `paranoid`
- **{RegExp}** `lfi`
- **{RegExp}** `sql`

#### {Object} currency
- **{RegExp}** `dollars`

#### {Object} code
- **{RegExp}** `cli`
- **{Object}** `comment`
  + **{RegExp}** `single`
  + **{RegExp}** `block`
- **{Object}** `color`
  + **{RegExp}** `hex`
  + **{RegExp}** `rgb`




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