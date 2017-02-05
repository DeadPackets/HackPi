![status](https://secure.travis-ci.org/wearefractal/BetterRegExp.png?branch=master)

## Information

<table>
<tr> 
<td>Package</td><td>BetterRegExp</td>
</tr>
<tr>
<td>Description</td>
<td>Utility wrapper over RegExp</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

## Usage

### Constructor

```coffee-script
BetterRegExp = require "BetterRegExp"

# Create from RegExp
pat = BetterRegExp /^\s*\d+\s*$/gi
pat = BetterRegExp /^\s*\d+\s*$/
pat = BetterRegExp /^\s*\d+\s*$/, "gi"

# Create from String
pat = BetterRegExp "^\s*\d+\s*$", "gi"
pat = BetterRegExp "^\s*\d+\s*$""
```

### Flags

```coffee-script
pat = BetterRegExp /^\s*\d+\s*$/g

pat.addFlag('i') # Adding flags
pat.removeFlag('g') # Removing flags
pat.flags === 'i' # List flags
pat.addFlag('gm').removeFlag('i') # Chaining

# There are aliases to help make chaining easier
pat.g() = pat.addFlag('g')
pat.i() = pat.addFlag('i')
pat.m() = pat.addFlag('m')
pat.y() = pat.addFlag('y')
pat.x() = pat.addFlag('x')
pat.g().i() = pat.addFlag('gi')
pat.i().m().x() = pat.addFlag('imx')
```

### Misc.

```coffee-script
# Escaping
exp = BetterRegExp.escape "test"
pat = BetterRegExp exp, "g"

# Executing is the same
pat.exec "test"

# Testing is the same
pat.match "test"
```


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
