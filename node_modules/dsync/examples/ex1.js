var dsync = require("../"),
target    = {
	name: "craig",
	friends: [
	],
	save: function() {

	},
	toPublic: function() {
		return target;
	}
};


var synced = dsync(target);

synced.name = "john";
synced.save();

var synced2 = dsync(synced);
synced2.name = "jake";
synced2.save();

console.log(target);