

exports.connect = function(host) {
	if(arguments.length == 0) {
		host = window.location.origin;
	}



	return {
		Account: require("./account").connect(host)
	};
}