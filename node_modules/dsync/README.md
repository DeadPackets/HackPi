

###Example

```javascript

var dsync = require("dsync");

var target = {
	name: "craig",
	save: function() {
		//do nothing
	},
	toPublic: function() {
		return target;
	}
};


var syncable = dsync(target);

```
