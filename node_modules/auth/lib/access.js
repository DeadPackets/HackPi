
var all = [];

["GET", "POST", "PUT", "DELETE"].forEach(function(method) {
	all.push(exports[method] = method);
});

//don't want the array to be altered
exports.all = function(isSuper) {
	var acc = all.concat();
	if(isSuper) {
		acc.push(exports.SUPER);
	}
	return acc;
}

//outside of all - must be manually set.
exports.SUPER = "SUPER";